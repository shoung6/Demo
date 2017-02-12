<template>
  <div class="cartcontrol">
    <transition>
      <div class="cart-decrease" @click="decreaseCart" v-show="food.count>0">
        <i class="innr icon-remove_circle_outline"></i>
      </div>
    </transition>
    <transition>
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    </transition>
    <div class="cart-add icon-add_circle" @click="addCart"></div>
  </div>
</template>
<script>
  export default {
    props: {
      food: {
        type: Object
      }
    },
    created() {
    },
    methods: {
      addCart(e) {
        if (!e._constructed) {
          return
        }
        if (!this.food.count) {
          this.$set(this.food, 'count', 1)
        } else {
          this.food.count++
        }
        this.$nextTick(() => {
          this.$emit('add', e.target)
        })
      },
      decreaseCart(e) {
        if (!e._constructed) {
          return
        }
        if (this.food.count) {
          this.food.count--
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .cartcontrol{
    font-size: 0;
    .cart-decrease{
      display: inline-block;
      padding: 6px;
      .innr{
        font-size: 24px;
        line-height: 1;
        color: rgb(0,160,220);
        transition: all 0.4s;
        transform: rotate(0);
      }
      &.v-leave-active,&.v-enter-active{
        transition: all 0.4s;
      }
      &.v-enter,&.v-leave-active{
        transform: translate3d(24px,0,0);
        opacity: 0;
        .innr{
          transform: rotate(180deg);
        }
      }
    }
    .cart-count{
      display: inline-block;
      vertical-align: top;
      width: 12px;
      padding-top: 6px;
      line-height: 24px;
      text-align: center;
      font-size: 10px;
      color: rgb(147,153,159);
      &.v-enter,&.v-leave-active{
        opacity: 0;
      }
      &.v-leave-active,&.v-enter-active{
        transform: translate3d(0,0,0);
        transition: all 0.4s;
      }
    }
    .cart-add{
      display: inline-block;
      padding: 6px;
      font-size: 24px;
      line-height: 1;
      color: rgb(0,160,220);
    }
  }

</style>
