import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, BarChart2, ArrowLeft } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updatePoll } from '../store/pollsSlice';

const ViewPoll: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [userRating, setUserRating] = useState<boolean>(false);

  const poll = useSelector((state: RootState) =>
    state.polls.find(p => p.id === id)
  );

  useEffect(() => {
    if (!poll) {
      navigate('/');
    }
  }, [poll, navigate]);

  if (!poll) {
    return null;
  }

  const handleVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption && !hasVoted) {
      const updatedPoll = {
        ...poll,
        options: poll.options.map(opt =>
          opt.id === selectedOption ? { ...opt, votes: opt.votes + 1 } : opt
        ),
        totalVotes: poll.totalVotes + 1
      };
      dispatch(updatePoll(updatedPoll));
      setHasVoted(true);
    }
  };

  const handleStarClick = () => {
    if (!userRating) {
      const updatedPoll = {
        ...poll,
        stars: poll.stars + 1
      };
      dispatch(updatePoll(updatedPoll));
      setUserRating(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => navigate('/')}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft className="mr-1" /> Back to Polls
      </button>
      <h1 className="text-3xl font-bold mb-4">{poll.title}</h1>
      <p className="text-gray-600 mb-6">{poll.description}</p>

      {/* Star Rating Section */}
      <div className="mb-4">
        <span className="text-lg font-semibold">Rate this poll:</span>
        <div className="flex">
          <Star
            className={`h-8 w-8 cursor-pointer ${userRating ? 'text-yellow-500' : 'text-gray-400'} star-icon`}
            onClick={handleStarClick}
          />
        </div>
      </div>

      <form onSubmit={handleVote}>
        {poll.options.map((option) => (
          <div key={option.id} className="mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="pollOption"
                value={option.id}
                onChange={() => setSelectedOption(option.id)}
                disabled={hasVoted}
                className="mr-2"
              />
              {option.text}
            </label>
            <div className="mt-2 bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 rounded-full h-4"
                style={{ width: `${(option.votes / poll.totalVotes) * 100 || 0}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">
              {((option.votes / poll.totalVotes) * 100 || 0).toFixed(1)}% ({option.votes} votes)
            </span>
          </div>
        ))}
        <button
          type="submit"
          disabled={!selectedOption || hasVoted}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Vote
        </button>
      </form>
    </div>
  );
};

export default ViewPoll;
