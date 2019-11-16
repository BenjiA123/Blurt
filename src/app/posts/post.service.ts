import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient) { }
  getPosts() {
    this.http.get<{ message: string, posts: Post[] }>('http://localhost:3000/api/posts')
      .subscribe((postData) => {
        this.posts = postData.posts
        this.postsUpdated.next([...this.posts])
      });
  }
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  addPost(title: string, content: string) {
    const post: Post = { _id: null, title: title, content: content };
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        const Id = responseData.postId
        post._id = Id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      })

  }

  deletePost(postId: String) {
    this.http.delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post._id !== postId);
        this.posts = updatedPosts
        this.postsUpdated.next([...this.posts])
      })
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string }>
      (`http://localhost:3000/api/posts/${id}`)
  }
  updatePost(id: string, title: string, content: string) {
    const post: Post = { _id: id, title: title, content: content }
    this.http.put(`http://localhost:3000/api/posts/${id}`, post)
      .subscribe(response => {
        console.log(response)
        const updatedPosts = [...this.posts]
        const oldPostIndex = updatedPosts.findIndex(p => {
          p._id === post._id
          updatedPosts[oldPostIndex] = post
          this.posts = updatedPosts
          this.postsUpdated.next([...this.posts])
        })
      })
  }

}
