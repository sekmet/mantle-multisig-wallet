import { TrashIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

const List = () => {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    if (inputValue.trim() !== '' && !items.includes(inputValue)) {
      setItems([...items, inputValue]);
      setInputValue('');
    }
  };

  const handleDeleteItem = (item) => {
    const newItems = items.filter((i) => i !== item);
    setItems(newItems);
  };

  return (
    <div className="mx-full mb-4 max-w-md">
      <div className="mb-4 flex border-b-2 border-gray-200 pb-4">
        <input
          type="text"
          placeholder="0x123456"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-black shadow focus:outline-none"
        />
        <button
          onClick={handleAddItem}
          className="ml-1 rounded bg-blue-500 px-4 py-1 text-white hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="flex items-center justify-between py-2">
            <span className="card bg-slate-200 p-2 dark:bg-navy-500">
              {item}
            </span>
            <button onClick={() => handleDeleteItem(item)}>
              <TrashIcon className="h-5 w-5 text-red-500" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
