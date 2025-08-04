<template>
  <div class="card-gallery">
     <div id="container">
        <div id="content">
            <div id="desc">This command list the HELP TOPICS </div>
            <p>hello-world-app % fw-icon-cli help</p>
        </div>
        <img src="../public/assets/readMe.showcase/crayons-icon-cli/cli-help.png" />
     </div>
      <div id="container">
        <div id="content">
            <div id="desc">This command COPIES the YML file to the command root. You may pass the dest also. </div>
            <p>hello-world-app % fw-icon-cli svgoYML</p>
        </div>
        <img src="../public/assets/readMe.showcase/crayons-icon-cli/output-yml.png" />
      </div>
      <div id="container">
        <div id="content">  
            <div id="desc">This command optimizes your SVGs. See the shorter version below. </div>  
            <p>hello-world-app % fw-icon-cli svgo --source ./src/assets/icons --destination ./public/assets/icons</p>
        </div>
        <img src="../public/assets/readMe.showcase/crayons-icon-cli/cli-optimize-icons.png" />
        <div id="content">    
            <p>hello-world-app % fw-icon-cli svgo -i ./src/assets/icons -o ./public/assets/icons</p>
        </div>
      </div>
      <div id="container">  
        <div id="content">   
            <div id="desc">This command optimizes your SVGs using your custom YML File. </div> 
            <p>hello-world-app % fw-icon-cli svgo --config ./svgo.yml -i ./src/assets/icons -o ./public/assets/icons</p>
        </div>
         <img src="../public/assets/readMe.showcase/crayons-icon-cli/custom-yml.png" />
      </div>    
  </div> 
</template>

<script>
export default {
  name: 'icon-ts-exports',

}
</script>

<style scoped>
#container {
  background-color: #1e1e1e;
  width: 100%;
  height: 100%;
  max-width: 800px;
  max-height: 600px;
  padding: 1em;
  overflow-x: scroll;
  white-space: nowrap;
}

#content {
  color: #ffffff;
  font-size: 12px;
  font-family: var(--base-font-family, monospace);
}
#desc {
  background-color: #a7ed83;
  color: #000000;
  font-size: 13px;
  font-family: var(--base-font-family, monospace);
  font-weight: bolder;
  padding-left: 5px;
  padding-bottom: 3px;
  text-align: center;
}
.card-gallery {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
</style>