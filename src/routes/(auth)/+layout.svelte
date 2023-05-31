<div class="holder">
    <slot/>
</div>

<style lang="scss">
    .holder {
        position: relative;
        background-color: var(--background);
        @supports (height: 100dvh) {
            min-height: 100dvh;
        }
        min-height: 100vh;
        display: grid;
        align-items: center;
        justify-content: center;
        max-width: 100%;
    }
</style>
