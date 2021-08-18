<template>
  <div id="modal-container">
    <div id="modal">
      <div class="modal-header">
        <slot name="header"></slot>
      </div>
      <div class="modal-body">
        <slot name="body"></slot>
      </div>
      <div class="modal-footer">
        <button @click="$emit('close')">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
};
</script>

<style scoped>
#modal-container {
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.33);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
#modal {
  display: flex;
  background-color: white;
  padding: 0.5rem;
  margin: 0.5rem;
  border-top: 1px solid #42b983;
  border-left: 1px solid #42b983;
  border-radius: 15px;
  box-shadow: 2px 2px 2px #42b983;
  justify-content: center;
  flex-direction: column;
}
.modal-header {
  text-align: center;
}
.modal-body {
  text-align: center;
}
.modal-footer {
  text-align: center;
}
.modal-footer button {
  margin: 1rem;
  font-size: 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  box-shadow: 2px 2px 1px lightgray;
  border-radius: 5px;
  padding: 0.5rem;
  cursor: pointer;
}
</style>
