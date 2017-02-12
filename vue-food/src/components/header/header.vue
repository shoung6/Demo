<template>
  <div class="header">
    <div class="content">
    	<div class="avatar">
    		<img :src="seller.avatar" width="64" height="64"/>
    	</div>
    	<div class="right">
    		<div class="name">
    			<span class="name-icon"></span>
    			<span class="text">{{seller.name}}</span>
    		</div>
    		<div class="two">
    		  {{seller.description}}/{{seller.deliveryTime}}分钟送达
    		</div>
    		<div class="three" v-if="seller.supports">
    			<span class="three-icon" :class="classMap[seller.supports[2].type]"></span>
    			<span class="text">{{seller.supports[2].description}}</span>
    		</div>
    	</div>
    	<div class="num" v-if="seller.supports" @click="detailShow=!detailShow">
    		<span>{{seller.supports.length}}个</span>
    		<i class="icon-keyboard_arrow_right"></i>
    	</div>
    </div>
    <div class="bottom-bar" @click="detailShow=!detailShow">
      <span class="img-icon"></span>
      <span class="text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="bg" style="filter: blur(10px);">
      <img :src="seller.avatar"/>
    </div>
    <transition name="fade">
      <div class="detail" v-show="detailShow">
        <div class="detail-wrapper f-cf">
          <div class="detail-content">
            <div class="title">{{seller.name}}</div>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title2">
              <span>优惠信息</span>
            </div>
            <ul>
              <li class="support-item" v-for="item in seller.supports">
                <span class="icon" :class="classMap[item.type]"></span>
                <span class="text">{{item.description}}</span>
              </li>
            </ul>
            <div class="title2">
              <span>商家公告</span>
            </div>
            <div class="bulletin">
              {{seller.bulletin}}
            </div>
          </div>
        </div>
        <div class="detail-close" @click="detailShow=!detailShow">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>

  </div>
</template>
  
<script>
  import star from 'components/star/star'

  export default {
    data() {
      return {
        detailShow: false
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    components: {
      star
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  @import "../../common/scss/mixin.scss";

  .header{
    position: relative;
    background-color: rgba(7,17,27,.5);
    color: #fff;
    .content{
      height: 80px;
      padding: 24px 0 0 24px;
      display: flex;
      position: relative;
      .avatar{
        img{
          border-radius: 4px;
        }
      }
      .right{
        flex: 1;
        margin-left: 16px;
        padding-top: 2px;
        .name{
          font-size: 0;
          .name-icon{
            width: 30px;
            height: 18px;
            margin-right: 6px;
            @include imgIcon(brand);
          }
          .text{
            vertical-align: middle;
            display: inline-block;
            font-size: 16px;
            font-weight: bold;
            line-height: 18px;
          }
        }
        .two{
          margin-top: 8px;
          font-size: 12px;
        }
        .three{
          margin-top: 10px;
          font-size: 0;
          .three-icon{
            width: 12px;
            height: 12px;
            margin-right: 4px;
            &.decrease{
              @include imgIcon(decrease_1);
            }
            &.discount{
              @include imgIcon(discount_1);
            }
            &.guarantee{
              @include imgIcon(guarantee_1);
            }
            &.special{
              @include imgIcon(special_1);
            }
            &.invoice{
              @include imgIcon(invoice_1);
            }
          }
          .text{
            display: inline-block;
            font-size: 12px;
            line-height: 12px;
          }
        }
      }
      .num{
        height: 24px;
        padding: 0 8px;
        border-radius: 12px;
        font-size: 12px;
        background-color: rgba(0,0,0,.2);
        position: absolute;
        right: 12px;
        bottom: 18px;
        span{
          vertical-align: top;
          line-height: 24px;
        }
        i{
          line-height: 24px;
        }
      }
    }
    .bottom-bar{
      background-color: rgba(7,17,27,.2);
      position: relative;
      height: 28px;
      padding-left: 12px;
      padding-right: 31px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .img-icon{
        @include imgIcon(bulletin);
        width: 22px;
        height: 12px;
        margin-top: 8px;
      }
      .text{
        font-size: 12px;
        line-height: 28px;
      }
      i{
        position: absolute;
        right: 12px;
        line-height: 28px;
        top: 0;
      }
    }
    .bg{
      z-index: -1;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
/*      filter: blur(10px); 为什么写在这里无效*/
      img{
        width: 100%;
      }
    }
    .detail{
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
      height: 100%;
      width: 100%;
      overflow: auto;
      background-color: rgba(7,17,27,.8);
      backdrop-filter: blur(10px);
      transition: all 0.4s;
      &.fade-enter,&.fade-leave-active{
        opacity: 0;
      }
      .detail-wrapper{
        min-height: 100%;
        width: 100%;
        .detail-content{
          padding: 64px 36px;
          .title{
            text-align: center;
            font-size: 16px;
            font-weight: 700;
          }
          .star-wrapper{
            margin-top: 16px;
            text-align: center;
          }
          .title2{
            position: relative;
            margin: 28px auto 24px;
            width: 100%;
            overflow: hidden;
            text-align: center;
              line-height: 1;
            span{
              font-weight: 700;
              font-size: 14px;
            }
            &:before{
              content: '';
              height: 1px;
              background-color: rgba(255,255,255,.2);
              position: absolute;
              top: 6px;
              right: 50%;
              width: 50%;
              margin-right: 40px;
            }
            &:after{
              content: '';
              height: 1px;
              background-color: rgba(255,255,255,.2);
              position: absolute;
              top: 6px;
              left: 50%;
              width: 50%;
              margin-left: 40px;
            }
          }
          .support-item{
            margin-bottom: 12px;
            margin-left: 12px;
            .icon{
              width: 16px;
              height: 16px;
              margin-right: 6px;
              &.decrease{
                @include imgIcon(decrease_2);
              }
              &.discount{
                @include imgIcon(discount_2);
              }
              &.guarantee{
                @include imgIcon(guarantee_2);
              }
              &.special{
                @include imgIcon(special_2);
              }
              &.invoice{
                @include imgIcon(invoice_2);
              }
            }
            .text{
              vertical-align: top;
              display: inline-block;
              font-size: 12px;
              line-height: 16px;
            }
          }
          .bulletin{
            font-size: 12px;
            line-height: 24px;
            padding: 0 12px;
          }
        }
      }
      .detail-close{
        position: relative;
        width: 32px;
        height: 32px;
        margin: -64px auto 0; 
        clear: both;
        font-size: 32px;
      }
    }
  }
</style>
