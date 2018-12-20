<template>
  <div id="app">
    <div v-bind:class="{ loader_wrapper: loader, 'd-none' : !loader }">
      <img class="svg-loader" src="http://localhost:8080/static/img/icons/icon.svg" alt="">
    </div>
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand to="/">My Vue App</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item to="/posts-manager">Posts Manager</b-nav-item>
          <b-nav-item href="#" @click.prevent="login" v-if="!activeUser">Login</b-nav-item>
          <b-nav-item href="#" @click.prevent="logout" v-else>Logout</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <flash-message class="myCustomClass"></flash-message>
    <!-- routes will be rendered here -->
    <router-view />
    <footer class="bg-dark text-white">
      <div class="container">
        <div class="d-flex justify-content-center flex-wrap border-bottom">
          <ul class="footer-list mb-5 p-0 mr-5 ml-5">
            <li class="mb-4">POSTS</li>
            <li><a class="text-white" href="/">Home</a></li>
            <li><a class="text-white" href="/posts-manager">Posts Manager</a></li>
          </ul>
          <ul class="footer-list mb-5 p-0 mr-5 ml-5">
            <li class="mb-4">COMPANY</li>
            <li><a class="text-white" href="/">About us</a></li>
            <li><a class="text-white" href="/posts-manager">Jobs</a></li>
            <li><a class="text-white" href="/posts-manager">Contact Us</a></li>
          </ul>
          <ul class="footer-list mb-5 p-o mr-5 ml-5">
            <li class="mb-4">AFFILIATE PROGRAM</li>
            <li><a class="text-white" href="/">Register</a></li>
            <li><a class="text-white" href="/posts-manager">Learn more</a></li>
            <li><a class="text-white" href="/posts-manager">Payouts</a></li>
            <li><a class="text-white" href="/posts-manager">FAQ</a></li>
          </ul>
        </div>
        <p class="text-center mt-5">Project is made by Haroldas Zapalkis</p>
        <p class="text-center">KTU 2018 CopyRights</p>
      </div>
    </footer>
  </div>
</template>
<style>
  .spaces {
    padding: 100px 0;
  }
  footer {
    padding: 50px 0;
  }
  @media (max-width: 768px) {
    .spaces {
      padding: 50px 0;
    }
    footer {
      padding: 30px 0;
    }
  }
  .footer-list {
    list-style: none;
  }
  .footer-list li {
    cursor: pointer;
  }
  body { 
    background: black;
    min-height: 100vh;
    font-family: 'Indie Flower', cursive;
  }
  .loader_wrapper {
      height: 100vh;
      width: 100vw;
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 100;
      background: #000000;
  }
  .svg-loader {
    width: 300px;
  }
</style>
<script src="jquery-3.3.1.min.js"></script>
<script>
export default {
  name: 'app',
  data () {
    return {
      activeUser: null,
      loader: true
    }
  },
  async created () {
    this.loader = true
    await this.refreshActiveUser()
    this.loader = false
  },
  watch: {
    // everytime a route is changed refresh the activeUser
    '$route': 'refreshActiveUser'
  },
  methods: {
    login () {
      this.$auth.loginRedirect()
    },
    async refreshActiveUser () {
      this.activeUser = await this.$auth.getUser()
    },
    async logout () {
      await this.$auth.logout()
      await this.refreshActiveUser()
      this.$router.push('/')
    }
  }
}
</script>