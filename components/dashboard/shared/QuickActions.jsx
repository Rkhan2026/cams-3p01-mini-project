import QuickActionCard from './QuickActionCard.jsx';

/**
 * Reusable QuickActions component that renders a grid of action cards
 * @param {Object} props - Component props
 * @param {Array} props.actions - Array of action objects
 * @param {string} props.actions[].title - Action title
 * @param {string} props.actions[].description - Action description  
 * @param {React.ReactNode} props.actions[].icon - Action icon
 * @param {function} props.actions[].onClick - Action click handler
 * @param {string} props.actions[].color - Action color theme
 * @param {string} props.className - Additional CSS classes
 */
export default function QuickActions({ actions = [], className = "" }) {
  // Handle edge cases
  if (!actions || !Array.isArray(actions)) {
    console.warn('QuickActions: actions prop should be an array');
    return <div className={`mb-8 ${className}`}></div>;
  }

  if (actions.length === 0) {
    return <div className={`mb-8 ${className}`}></div>;
  }

  // Filter out invalid actions
  const validActions = actions.filter(action => {
    if (!action || typeof action !== 'object') {
      console.warn('QuickActions: Invalid action object found, skipping');
      return false;
    }
    
    if (!action.title || !action.description || !action.onClick) {
      console.warn('QuickActions: Action missing required properties (title, description, onClick), skipping');
      return false;
    }
    
    return true;
  });

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ${className}`}>
      {validActions.map((action, index) => (
        <QuickActionCard 
          key={index} 
          title={action.title}
          description={action.description}
          icon={action.icon}
          onClick={action.onClick}
          color={action.color || 'blue'}
        />
      ))}
    </div>
  );
}