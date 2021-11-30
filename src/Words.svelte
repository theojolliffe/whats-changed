<script>

    import define from "./radial-dendrogram/index.js";
    import {Runtime, Library, Inspector} from "./radial-dendrogram/runtime.js";

    const runtime = new Runtime();
    const main = runtime.module(define, Inspector.into(document.body));

</script>
