import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, MinusCircle, Link as LinkIcon, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addPoll, deletePoll } from '../store/pollsSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';

const Home: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isPublic, setIsPublic] = useState(true);
  const [pollCreated, setPollCreated] = useState(false);
  const [pollLink, setPollLink] = useState('');
  const popularPollsRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const polls = useSelector((state: RootState) => state.polls);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [popularPolls, setPopularPolls] = useState<Poll[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const popularPolls = popularPollsRef.current;
      if (popularPolls) {
        const rect = popularPolls.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        popularPolls.classList.toggle('visible', isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check visibility on initial load

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [description]);

  useEffect(() => {
    // Filtrar las encuestas públicas
    const publicPolls = polls.filter(poll => poll.isPublic);
    // Ordenar por número de estrellas (de mayor a menor)
    const sortedPublicPolls = publicPolls.sort((a, b) => b.stars - a.stars);
    // Tomar las primeras 5 encuestas (o menos si no hay suficientes)
    setPopularPolls(sortedPublicPolls.slice(0, 5));
  }, [polls]);

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length === 0 || description.trim().length === 0) {
      // Mostrar un error si el título o la descripción están vacíos
      return;
    }
    const newPoll = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      options: options.map((text, index) => ({ id: index.toString(), text, votes: 0 })),
      isPublic,
      totalVotes: 0,
      createdAt: new Date().toISOString(),
      stars: 0,
    };
    dispatch(addPoll(newPoll));
    setPollCreated(true);
    setPollLink(`/poll/${newPoll.id}`);
    setTitle('');
    setDescription('');
    setOptions(['', '']);
    setIsPublic(true);
    
    // Navigate to the newly created poll
    navigate(`/poll/${newPoll.id}`);
  };

  const handleDeletePoll = (id: string) => {
    dispatch(deletePoll(id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      setDescription(description + '\n');
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="min-h-screen flex flex-col justify-center items-center bg-curved pb-12">
        <h1 className="text-6xl font-black mb-4 text-black text-shadow-inner">Welcome to PollMaster</h1>
        <p className="text-2xl font-medium mb-12 text-gray-700">Create, manage, and participate in polls with ease.</p>
        
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-3xl p-8 w-full max-w-2xl">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter poll title (max 50 characters)"
            className="w-full p-3 mb-4 border rounded-lg text-lg font-medium"
            maxLength={50}
            required
          />
          <p className="text-sm text-gray-500 mb-4">{title.length}/50 characters</p>
          <textarea
            ref={textareaRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your poll question (Press Ctrl+Enter for new line)"
            className="w-full p-3 mb-4 border rounded-lg text-lg font-medium auto-expand"
            required
          />
          {options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-grow p-2 border rounded-lg font-medium"
                required
              />
              {index > 1 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  <MinusCircle />
                </button>
              )}
            </div>
          ))}
          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={addOption}
              className="text-black hover:text-gray-700 font-semibold"
            >
              <PlusCircle className="inline mr-1" /> Add Option
            </button>
            <div className="flex items-center">
              <label className="mr-2 font-medium">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="mr-1"
                />
                Public Poll
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-bold"
          >
            Create Poll
          </button>
        </form>
        
        {pollCreated && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg font-medium">
            Poll created successfully! 
            {isPublic ? (
              <span>Your poll will appear in the Your Polls section.</span>
            ) : (
              <div className="flex items-center mt-2">
                <span className="mr-2">Share this link with your friends:</span>
                <a href={pollLink} className="text-black hover:underline flex items-center font-semibold">
                  <LinkIcon size={16} className="mr-1" />
                  Private Poll Link
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {popularPolls.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Popular Polls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {popularPolls.map((poll) => (
              <div key={poll.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2 break-words" title={poll.title}>{poll.title}</h3>
                <p className="text-gray-600 mb-4 font-medium line-clamp-3">{poll.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 font-medium">
                  <span>Votes: {poll.totalVotes}</span>
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 mr-1" fill="currentColor" />
                    <span>{poll.stars}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => navigate(`/poll/${poll.id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                  >
                    View Poll
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {polls.length > 0 ? (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Your Polls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {polls.map((poll) => (
              <div key={poll.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2 break-words" title={poll.title}>{poll.title}</h3>
                <p className="text-gray-600 mb-4 font-medium line-clamp-3">{poll.description}</p>
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Votes: {poll.totalVotes}</span>
                  <span>Created: {new Date(poll.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => navigate(`/poll/${poll.id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                  >
                    View Poll
                  </button>
                  <button
                    onClick={() => handleDeletePoll(poll.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-semibold"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-xl text-gray-600">You haven't created any polls yet. Create your first poll above!</p>
        </div>
      )}

      {popularPolls.length === 0 && polls.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-xl text-gray-600">There are no polls available. Be the first to create a poll!</p>
        </div>
      )}
    </div>
  );
};

export default Home;
