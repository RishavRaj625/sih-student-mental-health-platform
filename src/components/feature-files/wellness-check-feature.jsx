// components/feature-files/wellness-check-feature.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FeatureViewer from '../FeatureViewer';

const WellnessCheckFeature = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [isCompleting, setIsCompleting] = useState(false);
  const [results, setResults] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // Wellness check questions
  const questions = [
    {
      id: 'mood',
      question: 'How would you describe your overall mood today?',
      type: 'scale',
      scale: [
        { value: 1, label: 'Very Low', emoji: '😢' },
        { value: 2, label: 'Low', emoji: '😞' },
        { value: 3, label: 'Neutral', emoji: '😐' },
        { value: 4, label: 'Good', emoji: '🙂' },
        { value: 5, label: 'Very Good', emoji: '😊' }
      ]
    },
    {
      id: 'energy',
      question: 'How are your energy levels?',
      type: 'scale',
      scale: [
        { value: 1, label: 'Very Low', emoji: '🔋' },
        { value: 2, label: 'Low', emoji: '🔋' },
        { value: 3, label: 'Moderate', emoji: '🔋🔋' },
        { value: 4, label: 'High', emoji: '🔋🔋🔋' },
        { value: 5, label: 'Very High', emoji: '⚡' }
      ]
    },
    {
      id: 'sleep',
      question: 'How well did you sleep last night?',
      type: 'scale',
      scale: [
        { value: 1, label: 'Very Poor', emoji: '😴' },
        { value: 2, label: 'Poor', emoji: '😴' },
        { value: 3, label: 'Average', emoji: '💤' },
        { value: 4, label: 'Good', emoji: '😌' },
        { value: 5, label: 'Excellent', emoji: '✨' }
      ]
    },
    {
      id: 'stress',
      question: 'What is your stress level right now?',
      type: 'scale',
      scale: [
        { value: 1, label: 'No Stress', emoji: '😌' },
        { value: 2, label: 'Low Stress', emoji: '🙂' },
        { value: 3, label: 'Moderate', emoji: '😐' },
        { value: 4, label: 'High Stress', emoji: '😰' },
        { value: 5, label: 'Very High', emoji: '🤯' }
      ]
    },
    {
      id: 'anxiety',
      question: 'How anxious do you feel today?',
      type: 'scale',
      scale: [
        { value: 1, label: 'Not at all', emoji: '😌' },
        { value: 2, label: 'A little', emoji: '🙂' },
        { value: 3, label: 'Somewhat', emoji: '😐' },
        { value: 4, label: 'Quite a bit', emoji: '😟' },
        { value: 5, label: 'Extremely', emoji: '😨' }
      ]
    },
    {
      id: 'social',
      question: 'How connected do you feel to others?',
      type: 'scale',
      scale: [
        { value: 1, label: 'Very Isolated', emoji: '😔' },
        { value: 2, label: 'Somewhat Lonely', emoji: '😞' },
        { value: 3, label: 'Neutral', emoji: '😐' },
        { value: 4, label: 'Connected', emoji: '🙂' },
        { value: 5, label: 'Very Connected', emoji: '😊' }
      ]
    },
    {
      id: 'coping',
      question: 'How well are you managing daily challenges?',
      type: 'scale',
      scale: [
        { value: 1, label: 'Very Poorly', emoji: '😣' },
        { value: 2, label: 'Poorly', emoji: '😞' },
        { value: 3, label: 'Managing', emoji: '😐' },
        { value: 4, label: 'Well', emoji: '🙂' },
        { value: 5, label: 'Very Well', emoji: '💪' }
      ]
    },
    {
      id: 'motivation',
      question: 'How motivated do you feel for daily activities?',
      type: 'scale',
      scale: [
        { value: 1, label: 'No Motivation', emoji: '😴' },
        { value: 2, label: 'Low', emoji: '😞' },
        { value: 3, label: 'Some', emoji: '😐' },
        { value: 4, label: 'Motivated', emoji: '🙂' },
        { value: 5, label: 'Very Motivated', emoji: '🚀' }
      ]
    }
  ];

  // Mock previous wellness checks for history
  const wellnessHistory = [
    {
      date: '2024-01-10',
      overallScore: 3.2,
      mood: 3,
      energy: 3,
      stress: 4,
      recommendations: ['Practice deep breathing', 'Consider light exercise']
    },
    {
      date: '2024-01-09',
      overallScore: 2.8,
      mood: 2,
      energy: 2,
      stress: 4,
      recommendations: ['Prioritize sleep', 'Reach out to support network']
    },
    {
      date: '2024-01-08',
      overallScore: 3.8,
      mood: 4,
      energy: 4,
      stress: 2,
      recommendations: ['Keep up current routines', 'Consider mindfulness practice']
    }
  ];

  const handleResponse = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const nextQuestion = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeAssessment();
    }
  };

  const prevQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeAssessment = () => {
    setIsCompleting(true);

    setTimeout(() => {
      const scores = Object.values(responses);
      const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      
      // Generate recommendations based on responses
      const recommendations = generateRecommendations(responses, averageScore);
      
      setResults({
        overallScore: averageScore,
        responses: responses,
        recommendations: recommendations,
        date: new Date().toISOString().split('T')[0]
      });
      
      setIsCompleting(false);
    }, 2000);
  };

  const generateRecommendations = (responses, averageScore) => {
    const recommendations = [];
    
    if (responses.mood <= 2) {
      recommendations.push({
        category: 'Mood Support',
        suggestion: 'Consider engaging in activities that usually bring you joy or speaking with a counselor.',
        priority: 'high'
      });
    }
    
    if (responses.energy <= 2) {
      recommendations.push({
        category: 'Energy Boost',
        suggestion: 'Try light exercise, ensure adequate nutrition, and check your sleep patterns.',
        priority: 'medium'
      });
    }
    
    if (responses.sleep <= 2) {
      recommendations.push({
        category: 'Sleep Hygiene',
        suggestion: 'Establish a consistent bedtime routine and create a sleep-friendly environment.',
        priority: 'high'
      });
    }
    
    if (responses.stress >= 4) {
      recommendations.push({
        category: 'Stress Management',
        suggestion: 'Practice deep breathing, meditation, or consider professional stress management techniques.',
        priority: 'high'
      });
    }
    
    if (responses.anxiety >= 4) {
      recommendations.push({
        category: 'Anxiety Relief',
        suggestion: 'Try grounding techniques, limit caffeine, and consider speaking with a mental health professional.',
        priority: 'high'
      });
    }
    
    if (responses.social <= 2) {
      recommendations.push({
        category: 'Social Connection',
        suggestion: 'Reach out to friends or family, join a support group, or engage in community activities.',
        priority: 'medium'
      });
    }

    if (averageScore >= 4) {
      recommendations.push({
        category: 'Maintenance',
        suggestion: 'Great job! Continue your current wellness practices and consider helping others in your community.',
        priority: 'low'
      });
    }

    return recommendations;
  };

  const resetAssessment = () => {
    setCurrentStep(0);
    setResponses({});
    setResults(null);
    setIsCompleting(false);
  };

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleNavigateToResources = () => {
    navigate('/resources');
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  if (results) {
    return (
      <FeatureViewer title="Wellness Check Results">
        <div className="max-w-2xl mx-auto">
          {/* Results Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">
                {results.overallScore >= 4 ? '😊' : results.overallScore >= 3 ? '🙂' : results.overallScore >= 2 ? '😐' : '😔'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Assessment Complete</h3>
            <p className="text-gray-600">Overall Wellness Score: {results.overallScore.toFixed(1)}/5.0</p>
          </div>

          {/* Score Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Score Breakdown</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {questions.map(q => (
                <div key={q.id} className="text-center">
                  <div className="text-lg mb-1">
                    {q.scale.find(s => s.value === results.responses[q.id])?.emoji}
                  </div>
                  <div className="text-xs text-gray-600 capitalize">{q.id}</div>
                  <div className="font-medium">{results.responses[q.id]}/5</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Personalized Recommendations</h4>
            <div className="space-y-3">
              {results.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    rec.priority === 'high' 
                      ? 'bg-red-50 border-red-400 text-red-800'
                      : rec.priority === 'medium'
                      ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
                      : 'bg-green-50 border-green-400 text-green-800'
                  }`}
                >
                  <div className="font-medium text-sm">{rec.category}</div>
                  <div className="text-sm mt-1">{rec.suggestion}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={resetAssessment}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Take Another Check
            </button>
            <button
              onClick={handleNavigateToResources}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Explore Resources
            </button>
            <button
              onClick={handleNavigateToDashboard}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </FeatureViewer>
    );
  }

  return (
    <FeatureViewer title="Wellness Check-In">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={handleNavigateToDashboard}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
          >
            <span>🏠</span>
            <span>Home</span>
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
          >
            <span>📊</span>
            <span>History</span>
          </button>
        </div>
      </div>

      {/* History View */}
      {showHistory && (
        <div className="mb-6 bg-purple-50 rounded-lg p-4">
          <h4 className="font-semibold text-purple-900 mb-3">Recent Wellness Checks</h4>
          <div className="space-y-2">
            {wellnessHistory.map((entry, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-purple-200">
                <div>
                  <span className="text-sm text-purple-800">{entry.date}</span>
                  <div className="text-xs text-purple-600">
                    Score: {entry.overallScore}/5.0
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg">
                    {entry.overallScore >= 4 ? '😊' : entry.overallScore >= 3 ? '🙂' : entry.overallScore >= 2 ? '😐' : '😔'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Question {currentStep + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-600">{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Current Question */}
      {currentQuestion && !isCompleting && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {currentQuestion.question}
            </h3>
            <p className="text-gray-600">Select the option that best describes your current state</p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.scale.map((option) => (
              <button
                key={option.value}
                onClick={() => handleResponse(currentQuestion.id, option.value)}
                className={`w-full p-4 rounded-lg border-2 transition-all flex items-center space-x-4 ${
                  responses[currentQuestion.id] === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{option.emoji}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-800">{option.label}</div>
                  <div className="text-sm text-gray-600">Rating: {option.value}/5</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  responses[currentQuestion.id] === option.value
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300'
                }`}>
                  {responses[currentQuestion.id] === option.value && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentStep === 0}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Previous
            </button>
            <button
              onClick={nextQuestion}
              disabled={!responses[currentQuestion.id]}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {currentStep === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isCompleting && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">🔄</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Processing Your Assessment</h3>
          <p className="text-gray-600">Analyzing your responses and generating personalized recommendations...</p>
        </div>
      )}

      {/* Feature Info */}
      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">About Wellness Check-Ins</h4>
        <p className="text-blue-800 text-sm mb-2">
          Regular wellness check-ins help you track your mental health over time and identify patterns 
          in your wellbeing. This assessment provides personalized recommendations based on your responses.
        </p>
        <div className="text-sm text-blue-700">
          <p><strong>📊 Track Progress:</strong> Monitor your wellness trends over time</p>
          <p><strong>🎯 Personalized Tips:</strong> Get recommendations tailored to your current state</p>
          <p><strong>🔒 Private & Secure:</strong> Your responses are confidential</p>
        </div>
      </div>
    </FeatureViewer>
  );
};

export default WellnessCheckFeature;