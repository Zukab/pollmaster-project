import React from 'react';
import { Link } from 'react-router-dom';
import { List, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const polls = useSelector((state: RootState) => state.polls);

  const groupPollsByDate = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    return polls.reduce((groups, poll) => {
      const pollDate = new Date(poll.createdAt).toDateString();
      let group;

      if (pollDate === today) {
        group = 'Today';
      } else if (pollDate === yesterday) {
        group = 'Yesterday';
      } else {
        group = pollDate;
      }

      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(poll);
      return groups;
    }, {} as Record<string, typeof polls>);
  };

  const groupedPolls = groupPollsByDate();

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 bg-gray-100 p-6 transition-transform duration-300 ease-in-out z-30 overflow-y-auto`}
      >
        <nav>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <List className="mr-2" /> My Open Polls
          </h2>
          {Object.entries(groupedPolls).map(([date, datePolls]) => (
            <div key={date} className="mb-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">{date}</h3>
              <ul className="space-y-2">
                {datePolls.map((poll) => (
                  <li key={poll.id} className="border-b border-gray-200 pb-2">
                    <Link 
                      to={`/poll/${poll.id}`} 
                      className="text-gray-600 hover:text-blue-600 block"
                    >
                      <div 
                        className="px-2 py-1 overflow-hidden"
                        title={poll.title}
                      >
                        <span className="block truncate text-sm">
                          {poll.title}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <button
        className={`fixed top-1/2 transform -translate-y-1/2 ${
          isOpen ? 'left-64' : 'left-0'
        } bg-blue-600 text-white p-2 rounded-r-md transition-all duration-300 ease-in-out z-40`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </button>
    </>
  );
};

export default Sidebar;
