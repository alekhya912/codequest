import React from 'react';
import { Users, Plus, X } from 'lucide-react';
import './friendSuggestions.css';

const FriendSuggestions = () => {
// This would be fetched from your API in a real app
const suggestions = [
{
id: '1',
name: 'Girish',
avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
mutualFriends: 1
},
{
id: '2',
name: 'Pavan12',
avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
mutualFriends: 1
},
{
id: '3',
name: 'V S P Latha',
avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
mutualFriends: 1
}
];

return (
<div className="friend-suggestions">
<div className="friend-suggestions-header">
<h3>People you may know</h3>
<Users size={18} />
</div>


  <div className="suggestions-list">
    {suggestions.map((suggestion) => (
      <div key={suggestion.id} className="suggestion-item">
        <div className="suggestion-avatar">
          <img src={suggestion.avatar} alt={suggestion.name} />
        </div>
        <div className="suggestion-info">
          <h4>{suggestion.name}</h4>
          <p>
            {suggestion.mutualFriends} mutual {suggestion.mutualFriends === 1 ? 'friend' : 'friends'}
          </p>
        </div>
        <div className="suggestion-actions">
          <button className="add-friend-btn">
            <Plus size={16} />
          </button>
          <button className="ignore-suggestion-btn">
            <X size={16} />
          </button>
        </div>
      </div>
    ))}
  </div>
  
  <div className="view-all-wrapper">
    <button className="view-all-friends">View all friend suggestions</button>
  </div>
</div>
);
};

export default FriendSuggestions;