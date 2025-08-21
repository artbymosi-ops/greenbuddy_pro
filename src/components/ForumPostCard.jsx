export default function ForumPostCard({ post, onReact }) {
  return (
    <article className="card" style={{marginBottom:12}}>
      <div className="title" style={{marginTop:0}}>{post.title}</div>
      {post.body && <p style={{whiteSpace:"pre-wrap"}}>{post.body}</p>}
      <div className="subtitle" style={{display:"flex",gap:12,alignItems:"center"}}>
        <span>{new Date(post.created_at || post.ts).toLocaleString()}</span>
        <button className="btn ghost" onClick={()=>onReact?.(post,"like")} aria-label="Like">👍 {post.likes||0}</button>
      </div>
    </article>
  );
}
