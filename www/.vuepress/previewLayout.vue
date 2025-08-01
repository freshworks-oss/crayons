<template>
  <div class="container">
    <div class="preview block preview-container">
      <slot name="preview"></slot>
      <div class="seeCode" @click="toggle">{{showCode ? 'Hide Code' : 'Show Code'}}</div>
    </div>
    <div :class="`language-jsx editor block code`" v-if="showCode">
      <slot name="editor" ></slot>
      <div class="copy" ref="copyBtn" @click="copyToClipboard">Copy</div>
    </div>
  </div>
</template>

<script>
import "prismjs/themes/prism-tomorrow.css";
import "vue-prism-editor/dist/prismeditor.min.css";
export default {
  squiggles: false,
  data() {
    return {
      showCode: false
    };
  },
  methods: {
    toggle() {
      this.showCode =!this.showCode;
    },
    async copyToClipboard() {
      const code =  this.$slots['editor'].reduce((code, node) => code + node.context.model, '');
      const el = document.createElement('textarea');
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.$refs['copyBtn'].innerText = 'Copied!';
      await setTimeout(() => this.reset(), 2000);
    },
    reset() {
      this.$refs['copyBtn'].innerText = 'Copy';
    }
  }
}
</script>

<style lang="css">
  .VueLive-squiggles-wrapper {
	 display: none;
}
 .VueLive-error {
	 padding: 1.25rem 1.5rem;
	 border-radius: 6px;
	 overflow: hidden;
	 color: #fff;
	 font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
	 font-size: 0.85em;
	 text-align: left;
	 white-space: pre-wrap;
	 word-spacing: normal;
	 word-break: normal;
	 word-wrap: normal;
	 line-height: 1.65;
}
 .prism-editor-wrapper {
	 background-color: #002540;
}
 .prism-editor-wrapper .prism-editor__editor, .prism-editor-wrapper .prism-editor__textarea {
	 padding: 1.25rem 1.5rem;
	 border-radius: 6px;
	 overflow: hidden;
	 color: #fff;
	 font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
	 font-size: 0.85em;
	 text-align: left;
	 white-space: pre-wrap;
	 word-spacing: normal;
	 word-break: normal;
	 word-wrap: normal;
	 line-height: 1.65;
	 -moz-tab-size: 4;
	 -o-tab-size: 4;
	 tab-size: 4;
	 -webkit-hyphens: none;
	 -ms-hyphens: none;
	 hyphens: none;
}
 
</style>

<style lang="css" scoped>
.container {
	 margin: 20px 0;
	 position: relative;
}
 .container .preview-container {
	 position: relative;
	 padding: 20px 30px 40px;
	 box-shadow: rgba(0, 0, 0, 0.1) 0 1px 3px 0;
	 border-radius: 4px;
	 background: var(--color-fill-surface, #fff);
	 border-width: 1px;
	 border-style: solid;
	 border-color: var(--color-boundary-border-mildest, #cfd7df);
}
 @media screen and (prefers-reduced-motion: reduce) {
	 .container .code {
		 position: relative;
		 transition: none;
	}
}
 .container .code {
	 position: relative;
	 transition: all 0.25s ease;
}
 .container .seeCode {
	 position: absolute;
	 bottom: 0;
	 right: 0;
	 cursor: pointer;
	 display: flex;
	 align-items: center;
	 color: var(--color-text-primary, #12344d);
	 font-size: 12px;
	 line-height: 16px;
	 font-weight: 700;
	 margin-left: -1px;
	 border-width: 1px 0 0 1px;
	 border-style: solid none none solid;
	 padding: 4px 10px;
	 background: var(--color-fill-surface, #fff);
	 border-top: 1px solid var(--color-boundary-border-mildest, #cfd7df);
	 border-left: 1px solid var(--color-boundary-border-mildest, #cfd7df);
	 border-radius: 4px 0 4px 0;
}
 .copy {
	 position: absolute;
	 bottom: 4px;
	 right: 4px;
	 cursor: pointer;
	 display: flex;
	 align-items: center;
	 color: #fff;
	 font-size: 12px;
	 line-height: 16px;
	 font-weight: 300;
	 margin-left: -1px;
	 border: none;
	 padding: 4px 10px;
	 background: transparent;
	 border-radius: 4px;
}
 .copy:hover, .copy:focus {
	 background: #8e44ad;
}
 
</style>
