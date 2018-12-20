<template>
  <div class="spaces">
    <div class="container mt-5">
      <div class="col-12">
        <div v-for="post in posts" :key="post.id" class="row justify-content-center">
          <div v-bind:id=post.id class="col-12 col-md-8 col-lg-6 post-wrapper p-5 mb-5">
            <div class="row justify-content-center">
              <div class="col-12 mb-3 text-white">{{ post.title }}</div>
              <div class="col-12 mb-3 text-white">{{ post.body }}</div>
              <div class="w-100 mb-3">
                <img class="col-12" v-bind:src="'http://localhost:8081/public/img/' + post.image" />
              </div>
            </div>
            <div class="d-flex justify-content-between">
                <a class="btn btn-light" href="#submit-form" @click="populatePostToEdit(post)">Edit</a>
                <a class="btn btn-dark" href="#" @click.prevent="deletePost(post.id)">Delete</a>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-8 col-lg-6 justify-content-center p-5 m-auto text-left form-wrapper text-white">
        <h3 class="mb-5 text-center">{{ model.id ? 'Edit Post ID#' + model.id : 'New Post' }}</h3>
        <form id="submit-form" @submit.prevent="upload" class="row mb-3">
          <div class="div">
            <img v-bind:class="{ hidden: hideImage }" class="image-preview col-12" id="image-preview" src="#"/>
          </div>
          <div class="col-12 d-flex justify-content-between">
            <label class="mb-0 btn btn-light"  for="image">Select Image</label>
            <input class="input-file" id="image" type="file" name="image" accept="image/*" @change="loadFile()"/>
            <input class="btn btn-dark" type="submit" value="Upload" />
          </div>
        </form>
        <form @submit.prevent="savePost" class="col-12">
          <div class="row text-center">
            <label for="title">Post Title</label>
            <input id="title" class="col-12 mb-3" type="text" v-model="model.title">
            <label for="descrition">Post Description</label>
            <textarea id="description" class="col-12 mb-3" v-model="model.body"></textarea>
            <button class="col-12 mb-3 btn btn-info" type="submit" variant="success">Save Post</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
  html {
    scroll-behavior: smooth;
  }
  .post-wrapper {
    border-radius: 5px;
    border: solid 1px black;
    background-color: #333333;
  }
  .form-wrapper {
    border-radius: 5px;
    border: solid 1px black;
    background-color: #767676;
  }
  .input-file {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  .image-preview {
    margin: 0 auto 20px auto;
    width: 100%;
    display: flex;
  }
  .hidden {
    display: none;
  }
  .myCustomClass {
    position: sticky;
    top: 10px;
    margin: 0 20px;
    z-index: 2;
  }
  input, textarea {
    border-radius: 5px;
    border: solid 1px #333333c2;
    background-color: #fefefea1;
  }
</style>
<script>
import api from '@/api'
export default {
  data () {
    return {
      loading: false,
      posts: [],
      model: {},
      selectedFile: null,
      hideImage: true
    }
  },
  async created () {
    this.refreshPosts()
  },
  methods: {
    async refreshPosts () {
      this.loading = true
      this.posts = await api.getPosts()
      this.loading = false
    },
    async populatePostToEdit (post) {
      this.model = Object.assign({}, post)
    },
    async savePost () {
      if (this.model.id) {
        await api.updatePost(this.model.id, this.model)
      } else {
        await api.createPost(this.model)
      }
      this.model = {} // reset form
      this.hideImage = true
      await this.refreshPosts()
    },
    async deletePost (id) {
      if (confirm('Are you sure you want to delete this post?')) {
        // if we are editing a post we deleted, remove it from the form
        if (this.model.id === id) {
          this.model = {}
        }
        await api.deletePost(id)
        await this.refreshPosts()
      }
    },
    async upload () {
      this.loading = true
      var formData = new FormData()
      var imagefile = document.querySelector('#image')
      formData.append('image', imagefile.files[0])
      await api.upload(formData).then(response => {
        if (response.data.error) {
          this.flash(response.data.error, 'error', {
            timeout: 3000
          })
        } else {
          this.flash(response.data.message, 'success', {
            timeout: 3000
          })
          this.model.image = response.data.name
        }
        this.loading = false
      })
    },
    async loadFile () {
      var output = document.getElementById('image-preview')
      var imagefile = document.querySelector('#image').files[0]
      output.src = URL.createObjectURL(imagefile)
      this.hideImage = false
    }
  }
}
</script>
