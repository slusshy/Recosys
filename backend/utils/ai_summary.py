import os
from typing import List, Dict, Optional
from dotenv import load_dotenv
import logging
from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
import torch
import openai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class AISummarizer:
    def __init__(self):
        """Initialize the AI summarizer with either OpenAI or local model."""
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.local_model = None
        self.using_openai = bool(self.openai_key)

        if self.using_openai:
            openai.api_key = self.openai_key
            logger.info("Using OpenAI for summaries")
        else:
            logger.info("OpenAI key not found, falling back to local model")
            try:
                # Initialize FLAN-T5-small for efficient local summarization
                self.local_model = pipeline(
                    "text2text-generation",
                    model="google/flan-t5-small",
                    device="cuda" if torch.cuda.is_available() else "cpu"
                )
                logger.info("Local model initialized successfully")
            except Exception as e:
                logger.error(f"Error loading local model: {str(e)}")
                self.local_model = None

    def _format_recommendations(self, recommendations: List[Dict]) -> str:
        """Format the recommendations into a readable string."""
        titles = [f"'{r['title']}'" for r in recommendations[:3]]
        if len(titles) > 1:
            titles[-1] = f"and {titles[-1]}"
        return ", ".join(titles)

    def _generate_openai_summary(self, query: str, recommendations: List[Dict]) -> str:
        """Generate summary using OpenAI API."""
        try:
            titles = self._format_recommendations(recommendations)
            prompt = f"""Given a user query "{query}" and these recommendations: {titles},
            generate a short, natural summary (2-3 sentences) explaining why these items were recommended.
            Make it conversational and engaging."""

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful recommendation system assistant."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=150,
                temperature=0.7
            )

            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            return None

    def _generate_local_summary(self, query: str, recommendations: List[Dict]) -> str:
        """Generate summary using local model."""
        try:
            if not self.local_model:
                raise ValueError("Local model not initialized")

            titles = self._format_recommendations(recommendations)
            prompt = f"Summarize recommendations for query '{query}' with items: {titles}"

            result = self.local_model(
                prompt,
                max_length=100,
                min_length=30,
                num_beams=4
            )

            return result[0]['generated_text'].strip()
        except Exception as e:
            logger.error(f"Local model error: {str(e)}")
            return None

    def generate_summary(self, query: str, recommendations: List[Dict]) -> str:
        """
        Generate a natural language summary of recommendations.
        Falls back to template-based summary if AI generation fails.
        """
        if not recommendations:
            return f"Sorry, we couldn't find any recommendations matching your query: '{query}'"

        # Try AI-generated summary
        summary = None
        if self.using_openai:
            summary = self._generate_openai_summary(query, recommendations)
        elif self.local_model:
            summary = self._generate_local_summary(query, recommendations)

        # Fall back to template if AI generation fails
        if not summary:
            titles = self._format_recommendations(recommendations)
            category = "items"  # You could extract this from the query
            return f"Here are some {category} we found for your query '{query}'. The recommendations include {titles}."

        return summary

# Create a global instance
summarizer = AISummarizer()