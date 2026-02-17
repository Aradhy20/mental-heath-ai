"""
Test script for demonstrating the RAG and Vector Database functionality
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.text_service.vector_db import vector_db
from backend.text_service.rag import rag_system
from backend.text_service.text_analyzer import analyzer

def test_vector_database():
    """Test the vector database functionality"""
    print("=== Testing Vector Database ===")
    
    # Test searching for similar documents
    query = "I feel sad and hopeless most of the time"
    print(f"Query: {query}")
    
    results = vector_db.search_similar_documents(query, n_results=2)
    print(f"Found {len(results)} similar documents:")
    
    for i, doc in enumerate(results):
        print(f"\nDocument {i+1}:")
        print(f"  ID: {doc['id']}")
        print(f"  Content: {doc['content'][:100]}...")
        print(f"  Metadata: {doc['metadata']}")
        if doc.get('distance'):
            print(f"  Distance: {doc['distance']}")
    
    print("\n" + "="*50 + "\n")

def test_rag_system():
    """Test the RAG system functionality"""
    print("=== Testing RAG System ===")
    
    # Test generating responses
    test_inputs = [
        "I've been feeling really anxious lately and can't sleep well",
        "I'm having thoughts of not wanting to be here anymore",
        "I'm looking for ways to cope with stress from work"
    ]
    
    for text in test_inputs:
        print(f"Input: {text}")
        
        # Get emotion analysis
        emotion_label, emotion_score, confidence = analyzer.analyze_emotion(text)
        print(f"Emotion: {emotion_label} (Score: {emotion_score:.2f}, Confidence: {confidence:.2f})")
        
        # Get RAG-based response
        rag_result = rag_system.analyze_with_rag(text, emotion_label)
        
        print(f"Response: {rag_result['response'][:200]}...")
        print(f"Risk Level: {rag_result['risk_level']}")
        print(f"Context Documents: {len(rag_result['context'])}")
        print("-" * 40)
    
    print("\n" + "="*50 + "\n")

def test_contextual_analysis():
    """Test the full contextual analysis"""
    print("=== Testing Contextual Analysis ===")
    
    text = "I've been feeling really down and depressed for the past few weeks. I don't enjoy things I used to like."
    
    print(f"Input: {text}")
    
    # Perform contextual analysis
    result = analyzer.analyze_with_context(text)
    
    print(f"Emotion Analysis: {result['emotion_analysis']}")
    print(f"Risk Level: {result['risk_level']}")
    print(f"Response: {result['contextual_response'][:300]}...")
    print(f"Relevant Knowledge Documents: {len(result['relevant_knowledge'])}")
    print("Recommendations:")
    for i, rec in enumerate(result['recommendations']):
        print(f"  {i+1}. {rec}")
    
    print("\n" + "="*50 + "\n")

def test_adding_documents():
    """Test adding new documents to the vector database"""
    print("=== Testing Adding Documents ===")
    
    # Add a new mental health document
    new_document = {
        "id": "mhk_test_001",
        "content": "Mindfulness meditation has been shown to reduce symptoms of anxiety and depression by promoting relaxation and present-moment awareness. Regular practice can improve emotional regulation and overall mental well-being.",
        "category": "mindfulness",
        "severity": "low"
    }
    
    print(f"Adding document: {new_document['content'][:50]}...")
    vector_db.add_documents([new_document])
    
    # Test searching for the new document
    query = "How can mindfulness help with mental health?"
    print(f"Query: {query}")
    
    results = vector_db.search_similar_documents(query, n_results=1)
    if results:
        print(f"Found relevant document: {results[0]['content'][:100]}...")
    
    print("\n" + "="*50 + "\n")

if __name__ == "__main__":
    print("Testing RAG and Vector Database Implementation")
    print("="*50)
    
    try:
        test_vector_database()
        test_rag_system()
        test_contextual_analysis()
        test_adding_documents()
        
        print("All tests completed successfully!")
    except Exception as e:
        print(f"Error during testing: {str(e)}")
        import traceback
        traceback.print_exc()