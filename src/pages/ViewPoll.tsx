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
  const [hasStarred, setHasStarred] = useState(false);

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

  const handleStar = () => {
    const updatedPoll = {
      ...poll,
      stars: hasStarred ? poll.stars - 1 : poll.stars + 1
    };
    dispatch(updatePoll(updatedPoll));
    setHasStarred(!hasStarred);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => navigate('/')}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft className="mr-1" /> Volver a las encuestas
      </button>
      <h1 className="text-3xl font-bold mb-2 break-words">{poll.title}</h1>
      <p className="text-lg text-gray-700 mb-6 break-words">{poll.description}</p>
      <div className="mb-6 flex items-center">
        <button 
          onClick={handleStar}
          className={`flex items-center ${hasStarred ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-500`}
        >
          <Star className="w-6 h-6 mr-1" fill={hasStarred ? 'currentColor' : 'none'} />
          <span className="font-medium">{poll.stars}</span>
        </button>
      </div>
      {!hasVoted ? (
        <form onSubmit={handleVote}>
          <div className="space-y-4 mb-6">
            {poll.options.map((option) => (
              <div key={option.id} className="flex items-center">
                <input
                  type="radio"
                  id={option.id}
                  name="pollOption"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                  className="form-radio text-blue-600"
                />
                <label htmlFor={option.id} className="ml-2 flex-grow font-medium">
                  {option.text}
                </label>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors font-semibold"
          >
            Submit Vote
          </button>
        </form>
      ) : (
        <p className="text-green-600 mb-6 font-semibold">Thank you for voting!</p>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <BarChart2 className="mr-2" /> Results
        </h2>
        <div className="space-y-4">
          {poll.options.map((option) => (
            <div key={option.id} className="bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">{option.text}</span>
                <span className="text-gray-600 font-medium">{((option.votes / poll.totalVotes) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(option.votes / poll.totalVotes) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1 font-medium">{option.votes} votes</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-gray-600 font-medium">Total votes: {poll.totalVotes}</p>
      </div>
    </div>
  );
};

export default ViewPoll;
