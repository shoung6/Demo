<template>
  <div class="star" :class=starType>
    <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
  </div>
</template>
  
<script type="text/ecmascript-6">
  const LENGTH = 5
  const CLS_ON = 'on'
  const CLS_OFF = 'off'
  const CLS_HALF = 'half'
  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType() {
        return 'star' + this.size
      },
      itemClasses() {
        let result = []
        let score = Math.floor(this.score * 2) / 2
        let hasDeciml = score % 1 !== 0
        let integer = Math.floor(score)
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON)
        }
        if (hasDeciml) {
          result.push(CLS_HALF)
        }
        while (result.length < LENGTH) {
          result.push(CLS_OFF)
        }
        return result
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  @import "../../common/scss/mixin.scss";

  .star{
    font-size: 0;
  }
  .star-item{
    display: inline-block;
  }
  .star48{
    .star-item{
      width: 20px;
      height: 20px;
      margin-right: 20px;
      &:last-child{
        margin-right: 0;
      }
      &.on{
        @include imgIcon('star48_on');
      }
      &.half{
        @include imgIcon('star48_half');
      }
      &.off{
        @include imgIcon('star48_off');
      }
    }
  }
  .star36{
    .star-item{
      width: 15px;
      height: 15px;
      margin-right: 6px;
      &:last-child{
        margin-right: 0;
      }
      &.on{
        @include imgIcon('star36_on');
      }
      &.half{
        @include imgIcon('star36_half');
      }
      &.off{
        @include imgIcon('star36_off');
      }
    }
  }
  .star24{
    .star-item{
      width: 10px;
      height: 10px;
      margin-right: 3px;
      &:last-child{
        margin-right: 0;
      }
      &.on{
        @include imgIcon('star24_on');
      }
      &.half{
        @include imgIcon('star24_half');
      }
      &.off{
        @include imgIcon('star24_off');
      }
    }
  }
</style>
