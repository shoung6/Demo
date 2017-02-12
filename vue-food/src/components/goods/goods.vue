<template>
  <div class="goods">
    <div class="menu" ref="menuWrapper">
    	<ul>
    	  <li class="menu-item m-bb" v-for="(item,index) in goods" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
    	    <div class="text-wrapper">
            <span v-if="item.type>0" class="icon" :class="classMap[item.type]"></span><span class="text">{{item.name}}</span>
    	    </div>
    	  </li>
    	</ul>
    </div>
    <div class="foods" ref="foodsWrapper">
    	<ul>
    	  <li class="food-list j-list" v-for="item in goods">
    	    <div class="title">{{item.name}}</div>
    	    <ul>
    	      <li class="food-item m-bb" v-for="food in item.foods">
    	        <div class="food-img">
    	        	<img :src="food.icon" width="56" height="56" />
    	        </div>
    	        <div class="content">
    	        	<div class="name">{{food.name}}</div>
    	        	<p class="desc">{{food.description}}</p>
    	        	<div class="num">
    	        		<span>月售{{food.sellCount}}份</span>
    	        		<span>好评率{{food.rating}}%</span>
    	        	</div>
    	        	<div class="price">
    	        		<span class="now">&yen;{{food.price}}</span>
    	        		<span class="old" v-if="food.oldPrice">&yen;{{food.oldPrice}}</span>
    	        	</div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol v-on:add="_drop" :food="food"></cartcontrol>
                </div>
    	        </div>
    	      </li>
    	    </ul>
    	  </li>
    	</ul>
    </div>
    <shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    <div class="ball-container">
      <div v-for="ball in balls">
        <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
          <div class="ball" v-show="ball.show">
            <div class="inner j-inner"></div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
  
<script>
  import BScroll from 'better-scroll'
  import shopcart from 'components/shopcart/shopcart'
  import cartcontrol from 'components/cartcontrol/cartcontrol'

  const ERR_OK = 0
  export default {
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: []
      }
    },
    methods: {
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        })
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3
        })
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('j-list')
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      selectMenu(index, event) {
        if (!event._constructed) {
          return
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('j-list')
        let el = foodList[index]
        this.foodsScroll.scrollToElement(el, 300)
      },
      _drop(el) {
        for (let i in this.balls) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
      beforeEnter: function(el) {
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top - 22)
            el.style.display = ''
            el.style.webkitTransform = `translate3d(0,${y}px,0)`
            el.style.transform = `translate3d(0,${y}px,0)`
            let inner = el.querySelector('.j-inner')
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`
            inner.style.transform = `translate3d(${x}px,0,0)`
          }
        }
      },
      enter: function(el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)'
          el.style.transform = 'translate3d(0,0,0)'
          let inner = el.querySelector('.j-inner')
          inner.style.webkitTransform = 'translate3d(0,0,0)'
          inner.style.transform = 'translate3d(0,0,0)'
          el.addEventListener('transitionend', done)
        })
      },
      afterEnter: function(el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
        return 0
      },
      selectFoods() {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    created() {
      this.$http.get('/api/goods').then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          this.goods = response.data
          this.$nextTick(() => {
            this._initScroll()
            this._calculateHeight()
          })
        }
      })
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    components: {
      shopcart,
      cartcontrol
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  @import "../../common/scss/mixin.scss";
  
  .goods{
    position: absolute;
    top: 172px;
    left: 0;
    bottom: 46px;
    width: 100%;
    overflow: hidden;
    display: flex;
    .menu{
      flex: 0 0 80px;
      width: 80px;
      background-color: #f3f5f7;
      .menu-item{
        width: 100%;
        display: table;
        height: 54px;
        &.current{
          background-color: #fff;
        }
        .text-wrapper{
          display: table-cell;
          vertical-align: middle;
          padding: 0 12px;
          line-height: 14px;
          font-size: 12px;
          .icon{
            width: 12px;
            height: 12px;
            margin-right: 2px;
            &.decrease{
              @include imgIcon(decrease_3);
              vertical-align: middle;
            }
            &.discount{
              @include imgIcon(discount_3);
              vertical-align: middle;
            }
            &.guarantee{
              @include imgIcon(guarantee_3);
              vertical-align: middle;
            }
            &.special{
              @include imgIcon(special_3);
              vertical-align: middle;
            }
            &.invoice{
              @include imgIcon(invoice_3);
              vertical-align: middle;
            }
          }
          .text{
            vertical-align: middle;
          }
        }
        
      }
    }
    .foods{
      flex: 1;
      .food-list{
        
      }
      .title{
        padding-left: 14px;
        border-left: 2px solid #d9dde1;
        height: 26px;
        line-height: 26px;
        font-size: 12px;
        color: rgb(147,153,159);
        background-color: #f3f5f7;
      }
      .food-item{
        display: flex;
        margin: 18px;
        margin-bottom: 0;
        padding-bottom: 18px;  
        &:last-child:after{
          display: none;
        }
      }
      .food-img{
        width: 56px;
        margin-right: 10px;
      }
      .content{
        flex: 1;
        .name{
          margin: 2px 0 8px 0;
          font-size: 14px;
          color: rgb(7,17,27);
        }
        .desc,.num{
          line-height: 12px;
          font-size: 10px;
          color: rgb(147,153,159);
          margin-bottom: 8px;
        }
        .price{
          line-height: 14px;
          .now{
            margin-right: 8px;
            font-weight: 700;
            font-size: 14px;
            color: rgb(240,20,20);
          }
          .old{
            text-decoration: line-through;
            font-size: 10px;
            color: rgb(147,153,159);
          }
        }
        .cartcontrol-wrapper{
          position: absolute;
          right: 0;
          bottom: 10px;
        }
      }
    }
    .ball-container{
      .ball{
        position: fixed;
        left: 32px;
        bottom: 22px;
        z-index: 900;
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
        .inner{
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: rgb(0,160,220);
          transition: all 0.4s linear;
        }
      }
    }
  }
</style>
