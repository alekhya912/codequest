import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home/Home';
import Askquestion from './pages/Askquestion/Askquestion';
import Auth from './pages/Auth/Auth';
import Question from './pages/Question/Question';
import Displayquestion from './pages/Question/Displayquestion';
import Tags from './pages/Tags/Tags';
import Users from './pages/Users/Users';
import Userprofile from './pages/Userprofile/Userprofile';

// Public Space components
import FriendSuggestions from './pages/PublicSpace/friendSuggestions';
import PublicSpace from './pages/PublicSpace/publicSpace';
import Post from './pages/PublicSpace/post';
import PostCreation from './pages/PublicSpace/postCreation';
import PostList from './pages/PublicSpace/postList';

// Friend manager component
import FriendManager from './Comnponent/FriendManager/friendManager';

// Subscription pages
import SubscriptionPlans from './pages/Subscription/SubscriptionPlans';
import PaymentGateway from './pages/Subscription/PaymentGateway';
import ConfirmationPage from './pages/Subscription/ConfirmationPage';
import SubscriptionStatus from './pages/Subscription/SubscriptionStatus';

function Allroutes({ slidein, handleslidein }) {
  return (
    <Routes>
      <Route path='/' element={<Home slidein={slidein} handleslidein={handleslidein} />} />
      <Route path='/Askquestion' element={<Askquestion />} />
      <Route path='/Auth' element={<Auth />} />
      <Route path='/Question' element={<Question slidein={slidein} handleslidein={handleslidein} />} />
      <Route path='/Question/:id' element={<Displayquestion slidein={slidein} handleslidein={handleslidein} />} />
      <Route path='/Tags' element={<Tags slidein={slidein} handleslidein={handleslidein} />} />
      <Route path='/Users' element={<Users slidein={slidein} handleslidein={handleslidein} />} />
      <Route path='/Users/:id' element={<Userprofile slidein={slidein} handleslidein={handleslidein} />} />

      {/* Public Space Routes */}
      <Route path='/public-space' element={<PublicSpace slidein={slidein} handleslidein={handleslidein} />} />
      <Route path='/public-space/posts' element={<PostList />} />
      <Route path='/public-space/post/:id' element={<Post />} />
      <Route path='/public-space/create' element={<PostCreation />} />
      <Route path='/public-space/suggestions' element={<FriendSuggestions />} />
      <Route path='/public-space/friends' element={<FriendManager />} />

      {/* Subscription Routes */}
      <Route path='/subscription/plans' element={<SubscriptionPlans slidein={slidein} handleslidein={handleslidein} />} />
      <Route path='/subscription/payment' element={<PaymentGateway slidein={slidein} handleslidein={handleslidein} />} />
      <Route path='/subscription/confirmation' element={<ConfirmationPage slidein={slidein} handleslidein={handleslidein} />} />
      <Route path='/subscription/status' element={<SubscriptionStatus slidein={slidein} handleslidein={handleslidein} />} />
    </Routes>
  );
}

export default Allroutes;
