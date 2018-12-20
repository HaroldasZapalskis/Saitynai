<template>
  <div class="spaces">
    <div class="container mt-5">
      <div class="col-12">
        <div v-for="post in posts" :key="post.id" class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6 mb-5 post-wrapper text-white p-4 animation-element bounce-up">
            <h3>{{ post.title }}</h3>
            <p>{{ post.body }}</p>
            <img class="w-100" v-bind:src="'http://localhost:8081/public/img/' + post.image" alt="Post Image">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  .post-wrapper {
    border-radius: 5px;
    border: solid 1px #555555;
    background-color: #333333;
    transition: all 400ms linear;
  }
  .animation-element {
  position: relative;
  width: 30%;
  margin: 0% 1.33 2.66% 1.33%;
  float: left;
  }
  .bounce-up {
    opacity: 0;
    -moz-transition: all 700ms ease-out;
    -webkit-transition: all 700ms ease-out;
    -o-transition: all 700ms ease-out;
    transition: all 700ms ease-out;
    -moz-transform: translate3d(0px, 200px, 0px);
    -webkit-transform: translate3d(0px, 200px, 0px);
    -o-transform: translate(0px, 200px);
    -ms-transform: translate(0px, 200px);
    transform: translate3d(0px, 200, 0px);
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  .in-view {
    opacity: 1;
    transform: translate3d(0px, 0px, 0px);
  }
</style>
<script>
  import api from '@/api'
  import $ from 'jquery'

  var $window = $(window)
  function checkIfInView () {
    var $animationElements = $('.animation-element')
    var windowHeight = $window.height()
    var windowTopPosition = $window.scrollTop()
    var windowBottomPosition = (windowTopPosition + windowHeight)
    $.each($animationElements, function () {
      var $element = $(this)
      var elementHeight = $element.outerHeight()
      var elementTopPosition = $element.offset().top
      var elementBottomPosition = (elementTopPosition + elementHeight)
      if ((elementBottomPosition >= windowTopPosition) && (elementTopPosition <= windowBottomPosition)) {
        $element.addClass('in-view')
      } else {
        $element.removeClass('in-view')
      }
    })
  }
  $window.on('scroll resize', checkIfInView)
  $window.trigger('scroll')
  
  export default {
    data () {
      return {
        loading: false,
        posts: [],
        model: {}
      }
    },
    async created () {
      await this.refreshPosts().then(() => {
        checkIfInView()
      })
    },
    methods: {
      async refreshPosts () {
        this.loading = true
        this.posts = await api.getPosts()
        this.loading = false
      }
    }
  }
</script>
