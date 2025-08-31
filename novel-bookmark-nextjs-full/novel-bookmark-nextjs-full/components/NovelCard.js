
const NovelCard = ({ novel, isEditing, selected, onSelect }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #ddd', padding: '10px' }}>
      {isEditing && (
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(novel.id)}
        />
      )}
      <img src={novel.cover} alt={novel.title} width={60} height={60} style={{ borderRadius: '8px' }} />
      <div>
        <div><strong>{novel.title}</strong></div>
        <div>{novel.author}</div>
        <div style={{ fontSize: '12px', color: '#777' }}>{novel.chapter} | {novel.date}</div>
      </div>
    </div>
  );
};

export default NovelCard;
