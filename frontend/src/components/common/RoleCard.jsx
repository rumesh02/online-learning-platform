const RoleCard = ({ role, icon: Icon, description, onClick, selected = false }) => {
  return (
    <div
      onClick={onClick}
      className={`p-8 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        selected
          ? 'bg-yellow-500 text-gray-900 shadow-xl border-4 border-yellow-600'
          : 'bg-white text-gray-800 shadow-lg border-2 border-gray-200 hover:border-yellow-400'
      }`}
    >
      <div className="flex justify-center mb-4">
        <Icon className="w-16 h-16" />
      </div>
      <h3 className="text-2xl font-bold text-center mb-2">{role}</h3>
      <p className={`text-center ${selected ? 'text-gray-800' : 'text-gray-600'}`}>
        {description}
      </p>
    </div>
  );
};

export default RoleCard;
