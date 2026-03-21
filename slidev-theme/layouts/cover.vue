<template>
  <div class="slidev-layout cover">
    <div class="cover-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.cover {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.cover-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.cover-content p {
  font-size: 1.1rem;
  color: var(--slidev-theme-primary);
}
</style>
