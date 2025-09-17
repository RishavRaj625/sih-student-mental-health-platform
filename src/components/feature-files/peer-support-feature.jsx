// components/feature-files/peer-support-feature.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FeatureViewer from '../FeatureViewer';

const PeerSupportFeature = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('groups');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Mock support groups data
  const supportGroups = [
    {
      id: 1,
      name: 'Anxiety Support Circle',
      description: 'A safe space to share experiences and coping strategies for anxiety.',
      members: 127,
      category: 'Anxiety',
      isActive: true,
      lastActivity: '2 hours ago',
      meetingTime: 'Wednesdays 7:00 PM EST',
      moderator: 'Sarah M.',
      icon: '🤗'
    },
    {
      id: 2,
      name: 'Depression Recovery Group',
      description: 'Connect with others on the journey to overcoming depression.',
      members: 89,
      category: 'Depression',
      isActive: true,
      lastActivity: '1 hour ago',
      meetingTime: 'Mondays 6:00 PM EST',
      moderator: 'Mike R.',
      icon: '💪'
    },
    {
      id: 3,
      name: 'Young Adults Mental Health',
      description: 'Support group for young adults navigating mental health challenges.',
      members: 156,
      category: 'General',
      isActive: true,
      lastActivity: '30 minutes ago',
      meetingTime: 'Fridays 5:00 PM EST',
      moderator: 'Alex K.',
      icon: '🌱'
    },
    {
      id: 4,
      name: 'Workplace Stress Management',
      description: 'Strategies for managing stress and maintaining wellbeing at work.',
      members: 73,
      category: 'Stress',
      isActive: false,
      lastActivity: '1 day ago',
      meetingTime: 'Thursdays 8:00 PM EST',
      moderator: 'Jennifer L.',
      icon: '💼'
    }
  ];

  // Mock community posts data
  const communityPosts = [
    {
      id: 1,
      author: 'Anonymous User',
      content: 'Today was a really tough day, but I managed to get through it. Thank you all for the support yesterday.',
      timestamp: '2 hours ago',
      likes: 12,
      replies: 5,
      category: 'General',
      isAnonymous: true
    },
    {
      id: 2,
      author: 'Sarah M.',
      content: 'Sharing a breathing technique that really helped me during a panic attack. Inhale for 4, hold for 4, exhale for 6.',
      timestamp: '4 hours ago',
      likes: 23,
      replies: 8,
      category: 'Anxiety',
      isAnonymous: false
    },
    {
      id: 3,
      author: 'Mike R.',
      content: 'Remember: healing is not linear. Bad days don\'t erase your progress. You\'re stronger than you think! 💪',
      timestamp: '6 hours ago',
      likes: 34,
      replies: 12,
      category: 'Motivation',
      isAnonymous: false
    }
  ];

  // Mock upcoming sessions
  const upcomingSessions = [
    {
      id: 1,
      title: 'Mindfulness Monday',
      description: 'Weekly meditation and mindfulness practice session',
      time: 'Today, 7:00 PM EST',
      duration: '45 minutes',
      participants: 23,
      type: 'group',
      moderator: 'Dr. Lisa Chen'
    },
    {
      id: 2,
      title: 'Coping Strategies Workshop',
      description: 'Learn new techniques for managing difficult emotions',
      time: 'Tomorrow, 2:00 PM EST',
      duration: '60 minutes',
      participants: 15,
      type: 'workshop',
      moderator: 'Tom Wilson, LCSW'
    }
  ];

  const handleJoinGroup = (group) => {
    setSelectedGroup(group);
    setShowJoinModal(true);
  };

  const confirmJoinGroup = () => {
    setShowJoinModal(false);
    // Here you would typically make an API call to join the group
    alert(`Successfully joined ${selectedGroup.name}!`);
    setSelectedGroup(null);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setIsPosting(true);
    
    // Simulate posting
    setTimeout(() => {
      setIsPosting(false);
      setNewPost('');
      alert('Your post has been shared with the community!');
    }, 1500);
  };

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleNavigateToResources = () => {
    navigate('/resources');
  };

  return (
    <FeatureViewer title="Peer Support Community">
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
            onClick={handleNavigateToResources}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
          >
            <span>📚</span>
            <span>Resources</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'groups', label: 'Support Groups', icon: '👥' },
          { id: 'community', label: 'Community Posts', icon: '💬' },
          { id: 'sessions', label: 'Live Sessions', icon: '📅' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Support Groups Tab */}
      {activeTab === 'groups' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Join a Support Group</h3>
            <div className="text-sm text-gray-600">
              {supportGroups.filter(g => g.isActive).length} active groups
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {supportGroups.map(group => (
              <div key={group.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{group.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{group.name}</h4>
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {group.category}
                      </span>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${group.isActive ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{group.description}</p>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Members:</span>
                    <span>{group.members}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Moderator:</span>
                    <span>{group.moderator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Meets:</span>
                    <span>{group.meetingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Activity:</span>
                    <span>{group.lastActivity}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleJoinGroup(group)}
                  disabled={!group.isActive}
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    group.isActive
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {group.isActive ? 'Join Group' : 'Currently Inactive'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Community Posts Tab */}
      {activeTab === 'community' && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Community Posts</h3>

          {/* Create New Post */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Share with the Community</h4>
            <form onSubmit={handleCreatePost}>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your thoughts, experiences, or ask for support..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
              />
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Post anonymously
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={!newPost.trim() || isPosting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {isPosting ? 'Posting...' : 'Share Post'}
                </button>
              </div>
            </form>
          </div>

          {/* Community Posts List */}
          <div className="space-y-4">
            {communityPosts.map(post => (
              <div key={post.id} className="bg-white border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {post.isAnonymous ? '🎭' : '👤'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{post.author}</p>
                      <p className="text-sm text-gray-600">{post.timestamp}</p>
                    </div>
                  </div>
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {post.category}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{post.content}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                    <span>👍</span>
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                    <span>💬</span>
                    <span>{post.replies} replies</span>
                  </button>
                  <button className="hover:text-blue-600 transition-colors">
                    Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Sessions Tab */}
      {activeTab === 'sessions' && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Live Sessions</h3>

          <div className="space-y-4">
            {upcomingSessions.map(session => (
              <div key={session.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{session.title}</h4>
                    <p className="text-gray-600 text-sm mb-2">{session.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>🕒 {session.time}</span>
                      <span>⏱️ {session.duration}</span>
                      <span>👥 {session.participants} attending</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      session.type === 'group' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {session.type === 'group' ? 'Support Group' : 'Workshop'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    <strong>Facilitator:</strong> {session.moderator}
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Join Session
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Sessions Message */}
          {upcomingSessions.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">No Upcoming Sessions</h4>
              <p className="text-gray-600">Check back later for new live support sessions and workshops.</p>
            </div>
          )}
        </div>
      )}

      {/* Join Group Modal */}
      {showJoinModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Join {selectedGroup.name}?
            </h3>
            
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-3">{selectedGroup.description}</p>
              
              <div className="bg-blue-50 p-3 rounded-lg text-sm">
                <h4 className="font-medium text-blue-900 mb-2">Group Guidelines:</h4>
                <ul className="text-blue-800 space-y-1">
                  <li>• Respect others' privacy and experiences</li>
                  <li>• No judgment or unsolicited advice</li>
                  <li>• Keep discussions confidential</li>
                  <li>• Follow community guidelines</li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={confirmJoinGroup}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Join Group
              </button>
              <button
                onClick={() => setShowJoinModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Info */}
      <div className="mt-8 bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-2">About Peer Support</h4>
        <p className="text-green-800 text-sm mb-2">
          Connect with others who understand your journey. Our peer support community provides a safe, 
          moderated environment for sharing experiences and mutual support.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
          <div>
            <p><strong>🛡️ Safe Environment:</strong> Moderated by trained professionals</p>
            <p><strong>🤝 Mutual Support:</strong> Help and be helped by peers</p>
          </div>
          <div>
            <p><strong>🎭 Anonymous Options:</strong> Share comfortably and safely</p>
            <p><strong>📅 Regular Sessions:</strong> Scheduled group meetings and workshops</p>
          </div>
        </div>
        <div className="mt-3 p-3 bg-green-100 rounded-lg">
          <p className="text-xs text-green-700">
            <strong>Remember:</strong> Peer support complements but doesn't replace professional treatment. 
            If you're in crisis, please seek immediate professional help.
          </p>
        </div>
      </div>
    </FeatureViewer>
  );
};

export default PeerSupportFeature;