// components/feature-files/ai-chat-feature.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeatureViewer from '../FeatureViewer';

const AIChatFeature = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the Streamlit app when component loads
    
    // window.location.href = 'https://rag-vision-voice-doc-4yhmuhbqykuffdbdbiputq.streamlit.app/';
    window.open('https://rag-vision-voice-doc-4yhmuhbqykuffdbdbiputq.streamlit.app/', '_blank');
  }, []);

  const handleNavigateToResources = () => {
    navigate('/resources');
  };

  const handleNavigateToBooking = () => {
    navigate('/booking');
  };

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  // This component will only briefly show before redirecting
  return (
    <FeatureViewer title="AI Mental Health Chat">
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
          <span className="text-3xl">🤖</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          AI Chat Opened in New Tab
        </h3>
        <p className="text-gray-600 mb-6">
          Your AI mental health chat has opened in a new tab. You can continue using this dashboard while chatting with AI.
        </p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={handleNavigateToDashboard}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <span>🏠</span>
            <span>Back to Dashboard</span>
          </button>
          <button
            onClick={handleNavigateToResources}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <span>📚</span>
            <span>Resources</span>
          </button>
        </div>
      </div>

      {/* Feature Info */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">About AI Chat Support</h4>
        <p className="text-blue-800 text-sm">
          Our advanced AI counselor platform provides 24/7 support with vision, voice, and document processing capabilities. 
          Experience intelligent conversations with multimodal AI that can understand text, images, and voice inputs.
        </p>
        <div className="mt-3">
          <p className="text-xs text-blue-700">
            <strong>Features:</strong> Voice interaction, document analysis, image understanding, and comprehensive mental health support.
          </p>
          <p className="text-xs text-blue-700 mt-1">
            <strong>Remember:</strong> If you're experiencing a mental health emergency, 
            please contact emergency services or a crisis hotline immediately.
          </p>
        </div>
      </div>
    </FeatureViewer>
  );
};

export default AIChatFeature;