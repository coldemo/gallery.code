<template>
  <div class="container">
    <h1>Vue Single-file Component</h1>
    <h3>Hello. {{message}} {{count}}</h3>
    <button @click="add()">Add</button>
  </div>
</template>

<script>
module.exports = {
  data() {
    return { count: 0, message: 'This is Vue App.' };
  },
  mounted() {
    this.timerId = setInterval(this.add, 1000);
  },
  beforeDestroy() {
    let { timerId } = this;
    if (timerId) clearInterval(timerId);
  },
  methods: {
    add() {
      this.count++;
    },
  },
};
</script>

<style>
.container {
  padding: 20px;
}
</style>
