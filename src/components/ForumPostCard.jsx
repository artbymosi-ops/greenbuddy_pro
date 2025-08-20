import Link from "next/link";
import ReactionBar from "./ReactionBar";

export default function ForumPostCard({ post, onReact }) {
  const imgs = Array.isArray(post.images) ? post.images : [];
  return (
    <div className="card" style={{marginBottom:12}}>
      <Link href={`/forum/${post.id ?? post._localId}`} style={{textDecoration:"none", color:"inherit"}}>
        <h3 style={{marginTop:0}}>{post.title}</h3>
      </Link>
      <div className="subtitle" style={{marginBottom:8}}>
        {post.author_name || "User"} · {new Date(post.created_at).toLocaleString("de-DE")}
        {post.hidden ? " · (versteckt)" : ""}
      </div>
      <p style={{whiteSpace:"pre-wrap"}}>{post.body}</p>
      {imgs.length>0 && (
        <div className="grid" style={{gap:8, marginTop:8}}>
          {imgs.map((url,i)=>(
            <img key={i} src={url} alt="Foto" style={{width:"100%", maxWidth:180, aspectRatio:"1/1", objectFit:"cover", borderRadius:12}}/>
          ))}
        </div>
      )}
      <ReactionBar post={post} onReact={onReact}/>
      <Link className="btn ghost" href={`/forum/${post.id ?? post._localId}`} style={{marginTop:8}}>Details & Kommentare</Link>
    </div>
  );
}
