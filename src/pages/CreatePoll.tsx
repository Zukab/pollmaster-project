import React, { useState } from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';

const CreatePoll: React.FC = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState('');

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (title.length > 50) {
      setError('El título no puede exceder los 50 caracteres');
      return;
    }

    if (!description.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    if (options.filter(option => option.trim()).length < 2) {
      setError('Se requieren al menos dos opciones');
      return;
    }

    try {
      const pollRef = await addDoc(collection(db, 'polls'), {
        title: title.trim(),
        description: description.trim(),
        options: options.filter(option => option.trim()).map(option => ({
          text: option,
          votes: 0
        })),
        isPublic,
        createdBy: user?.uid,
        createdAt: serverTimestamp(),
        totalVotes: 0,
        stars: 0 // Initialize stars to 0
      });

      navigate(`/poll/${pollRef.id}`);
    } catch (error) {
      setError('Error al crear la encuesta. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Crear nueva encuesta</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título (máximo 50 caracteres)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            className="w-full p-2 border rounded-md"
            required
          />
          <p className="text-sm text-gray-500 mt-1">{title.length}/50 caracteres</p>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción de la encuesta
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Opciones</label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Opción ${index + 1}`}
                className="flex-grow p-2 border rounded-md"
                required
              />
              {index > 1 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="mt-2 text-blue-500 hover:text-blue-700"
          >
            + Añadir opción
          </button>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isPublic">Hacer esta encuesta pública</label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Crear encuesta
        </button>
      </form>
    </div>
  );
};

export default CreatePoll;
