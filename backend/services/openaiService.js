// OpenAI service for book detection
const axios = require('axios');
require('dotenv').config();

/**
 * OpenAI service for processing images and detecting books
 */
class OpenAIService {
  /**
   * Process an image using OpenAI's Vision API to detect books
   * @param {string} base64Image - Base64-encoded image data
   * @returns {Promise<Array>} Array of detected book objects with title and author
   */
  static async detectBooksInImage(base64Image) {
    try {
      console.log('Calling OpenAI API...');
      
      // Call OpenAI Vision API directly with environment variable
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Identify all book titles and authors visible on the book spines in this bookshelf image. Return a JSON array with objects containing only 'title' and 'author' for each book you can identify. Focus only on clearly readable text on the spines."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 1000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          }
        }
      );
      
      console.log('OpenAI API response received');
      
      // Parse the response to extract book data
      const content = response.data.choices[0].message.content;
      console.log('OpenAI content response:', content.substring(0, 100) + '...');
      
      // Extract JSON array from the response content
      // This handles cases where the API might return extra text surrounding the JSON
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      let booksData = [];
      
      if (jsonMatch) {
        booksData = JSON.parse(jsonMatch[0]);
        console.log('Parsed books data successfully');
      } else {
        throw new Error('Could not parse JSON response from OpenAI');
      }
      
      return booksData;
    } catch (error) {
      console.error('OpenAI API error:', error.message);
      throw new Error(`Failed to process image with OpenAI: ${error.message}`);
    }
  }
}

module.exports = OpenAIService;