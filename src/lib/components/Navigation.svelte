<script lang="ts">
    export let page:"LOGIN"|"REGISTER"|"IN"|"WELCOME" = "LOGIN";
</script>


<nav>
    <span> Chat app lmao</span>
    <a href="/">Home</a>
    <a href="/login">
        Login
    </a>
</nav>

<style lang="scss">
    nav{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: space-between;
    }
</style>
