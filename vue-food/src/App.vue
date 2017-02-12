<template>
  <div>
    <v-header :seller="seller"></v-header>
    <ul class="tab m-bb">
    	<li>
  	    <router-link to="/goods" replace>商品</router-link>
  	  </li>
    	<li>
    	  <router-link to="/ratings" replace>评论</router-link>
    	</li>
    	<li>
    	  <router-link to="/seller" replace>商家</router-link>
  	  </li>
    </ul>
    <router-view :seller="seller"></router-view>
  </div>
</template>
  
<script>
  import header from './components/header/header.vue'
  
  const ERR_OK = 0
  export default {
    data() {
      return {
        seller: {}
      }
    },
    components: {
      'v-header': header
    },
    created() {
      this.$http.get('/api/seller').then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          this.seller = response.data
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .tab{
    display: flex;
    li{
      flex: 1;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
      color: rgb(77,85,93);
      .router-link-active{
        color: rgb(240,20,20);
      }
      a{
        display: block;
      }
    }
  }
</style>
