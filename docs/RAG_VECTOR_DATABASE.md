# RAG and Vector Database Implementation

## Overview

This document describes the implementation of Retrieval-Augmented Generation (RAG) and vector database technology in the Multimodal Mental Health Detection System. This enhancement provides contextual understanding and knowledge-based responses to user inputs.

## Architecture

### Components

1. **Vector Database Service** - Stores mental health knowledge as embeddings
2. **RAG Engine** - Combines retrieval and generation for contextual responses
3. **Text Analysis Service** - Enhanced with contextual analysis capabilities
4. **Knowledge Management Service** - API for managing the knowledge base
5. **Frontend Integration** - New AI chat assistant component

### Technology Stack

- **ChromaDB** - Vector database for storing embeddings
- **Sentence Transformers** - For creating text embeddings
- **Langchain** - For RAG implementation
- **FastAPI** - For the knowledge management service

## Implementation Details

### Vector Database

The vector database stores mental health knowledge as embeddings for semantic search:

```python
# Initialize vector database
vector_db = VectorDatabase()

# Add documents
documents = [
    {
        "id": "mhk_001",
        "content": "Depression symptoms include persistent sadness...",
        "category": "depression",
        "severity": "high"
    }
]
vector_db.add_documents(documents)

# Search for similar documents
results = vector_db.search_similar_documents("I feel sad", n_results=3)
```

### RAG System

The RAG system combines retrieval and rule-based generation:

```python
# Initialize RAG system
rag_system = MentalHealthRAG()

# Analyze with context
result = rag_system.analyze_with_rag("I'm feeling anxious", "anxiety")
```

### Enhanced Text Analysis

The text analysis service now includes contextual analysis:

```python
# Traditional emotion analysis
emotion_label, emotion_score, confidence = analyzer.analyze_emotion(text)

# Contextual analysis with RAG
contextual_result = analyzer.analyze_with_context(text)
```

## API Endpoints

### Text Service

- `POST /analyze/text` - Traditional text analysis
- `POST /analyze/text/contextual` - Contextual analysis with RAG

### Knowledge Service

- `POST /knowledge/add` - Add new knowledge documents
- `POST /knowledge/query` - Query knowledge base
- `GET /knowledge/document/{doc_id}` - Retrieve specific document

## Frontend Integration

### AI Chat Assistant Component

A new React component provides an interactive chat interface:

```jsx
<AIChatAssistant />
```

Features:
- Real-time contextual responses
- Emotion analysis visualization
- Risk level assessment
- Personalized recommendations

## Usage Examples

### Backend Usage

```python
# Analyze text with context
result = analyzer.analyze_with_context("I've been feeling really down lately")

# Access results
emotion = result["emotion_analysis"]["emotion_label"]
response = result["contextual_response"]
risk_level = result["risk_level"]
```

### Frontend Usage

```javascript
// Call contextual analysis API
const result = await apiClient.analyzeTextContextual({
  text: "I'm feeling anxious about work",
  user_id: 123
});
```

## Benefits

1. **Contextual Understanding** - Responses based on relevant mental health knowledge
2. **Scalable Knowledge Base** - Easy to add new mental health information
3. **Semantic Search** - Finds relevant information even with different wording
4. **Risk Assessment** - Automated risk level determination
5. **Personalized Recommendations** - Tailored advice based on emotion and risk

## Future Enhancements

1. Integration with large language models for more sophisticated generation
2. Multi-lingual support for knowledge base
3. User feedback loop for continuous improvement
4. Integration with professional mental health resources
5. Advanced personalization based on user history

## Testing

Run the test script to verify functionality:

```bash
python test_rag_vector.py
```

This will test:
- Vector database search functionality
- RAG response generation
- Contextual analysis
- Adding new documents