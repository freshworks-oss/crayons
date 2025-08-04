<template>
  <a :href="cardLink" class="link-card" :target="linkTarget">
    <div class="card-container">
      <div class="img-container">
        <img
          :src="require(`../public/assets/${cardName}.png`)"
          :alt="cardName"
        />
      </div>
      <div class="card-title">
        {{ cardTitle }}
      </div>
      <div class="card-description">
        {{ cardDescription }}
      </div>
      <div class="learn-more">
        <span class="learn-more-text">Learn More &#8594;</span>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  name: 'detailCard',
  props: {
    cardName: String,
    cardTitle: String,
    cardDescription: String,
    cardLink: String,
  },
  computed: {
    linkTarget() {
      if (this.cardName === 'get-started') {
        return null;
      }
      return '_blank';
    },
  },
};
</script>

<style lang="css">
.link-card {
	 text-decoration: none;
	 text-align: center;
}
 @media screen and (prefers-reduced-motion: reduce) {
	 .link-card .card-container {
		 height: 420px;
		 width: 100%;
		 border-radius: 15px;
		 background-color: #fff;
		 box-shadow: 0 5px 20px 0 rgba(57, 115, 230, 0.1);
		 cursor: pointer;
		 border: 1px solid transparent;
		 transition: none;
		 box-sizing: border-box;
	}
	 .link-card .card-container .img-container {
		 text-align: center;
		 align-items: center;
	}
	 .link-card .card-container .img-container img {
		 width: 100%;
		 height: 100%;
	}
	 .link-card .card-container .card-title {
		 font-family: var(--base-font-family, 'System stack', sans-serif);
		 font-size: 20px;
		 color: #4d4d4d;
		 font-weight: 500;
		 padding-top: 15px;
	}
	 .link-card .card-container .card-description {
		 font-family: var(--base-font-family, 'System stack', sans-serif);
		 color: #666;
		 font-size: 15px;
		 letter-spacing: 0;
		 line-height: 28px;
		 padding: 15px;
	}
	 .link-card .card-container .learn-more {
		 font-family: var(--base-font-family, 'System stack', sans-serif);
		 margin-top: 10px;
	}
	 .link-card .card-container .learn-more .learn-more-text {
		 color: #3973e6;
		 font-size: 15px;
	}
	 .link-card .card-container:hover, .link-card .card-container:focus {
		 transform: translateY(-25px);
		 box-shadow: 0 10px 30px 0 rgba(57, 115, 230, 0.15);
		 border-color: rgba(57, 115, 230, 0.2);
	}
}
 .link-card .card-container {
	 height: 420px;
	 width: 100%;
	 border-radius: 15px;
	 background-color: #fff;
	 box-shadow: 0 5px 20px 0 rgba(57, 115, 230, 0.1);
	 cursor: pointer;
	 border: 1px solid transparent;
	 transition: transform 500ms;
	 box-sizing: border-box;
}
 .link-card .card-container .img-container {
	 text-align: center;
	 align-items: center;
}
 .link-card .card-container .img-container img {
	 width: 100%;
	 height: 100%;
}
 .link-card .card-container .card-title {
	 font-family: var(--base-font-family, 'System stack', sans-serif);
	 font-size: 20px;
	 color: #4d4d4d;
	 font-weight: 500;
	 padding-top: 15px;
}
 .link-card .card-container .card-description {
	 font-family: var(--base-font-family, 'System stack', sans-serif);
	 color: #666;
	 font-size: 15px;
	 letter-spacing: 0;
	 line-height: 28px;
	 padding: 15px;
}
 .link-card .card-container .learn-more {
	 font-family: var(--base-font-family, 'System stack', sans-serif);
	 margin-top: 10px;
}
 .link-card .card-container .learn-more .learn-more-text {
	 color: #3973e6;
	 font-size: 15px;
}
 .link-card .card-container:hover, .link-card .card-container:focus {
	 transform: translateY(-25px);
	 box-shadow: 0 10px 30px 0 rgba(57, 115, 230, 0.15);
	 border-color: rgba(57, 115, 230, 0.2);
}
 @media only screen and (max-width: 48rem) {
	 .link-card {
		 text-decoration: none;
		 text-align: center;
	}
  @media (prefers-reduced-motion) {
    .link-card .card-container {
      transition: none;
    }
  }
  .link-card .card-container {
		 height: 420px;
		 width: 80%;
		 margin: 0 auto;
		 border-radius: 15px;
		 background-color: #fff;
		 margin-top: 5%;
		 box-shadow: 0 5px 20px 0 rgba(57, 115, 230, 0.1);
		 cursor: pointer;
		 border: 1px solid transparent;
		 transition: transform 500ms;
		 box-sizing: border-box;
	}
	 .link-card .card-container .img-container {
		 text-align: center;
		 align-items: center;
	}
	 .link-card .card-container .img-container img {
		 width: 50%;
		 height: 50%;
	}
	 .link-card .card-container .card-title {
		 font-size: 1.75rem;
		 color: #4d4d4d;
		 font-weight: 500;
		 padding-top: 15px;
	}
	 .link-card .card-container .card-description {
		 font-family: var(--base-font-family, 'System stack', sans-serif);
		 color: #666;
		 font-size: 1.25rem;
		 letter-spacing: 0;
		 line-height: 28px;
		 padding: 15px;
	}
	 .link-card .card-container .learn-more {
		 font-family: var(--base-font-family, 'System stack', sans-serif);
		 margin-top: 10px;
	}
	 .link-card .card-container .learn-more .learn-more-text {
		 color: #3973e6;
		 font-size: 1.25rem;
	}
	 .link-card .card-container:hover, .link-card .card-container:focus {
		 transform: none;
		 box-shadow: none;
		 border-color: none;
	}
}
 @media only screen and (max-width: 48rem) and (prefers-reduced-motion: reduce) {
	 .link-card .card-container {
		 height: 420px;
		 width: 80%;
		 margin: 0 auto;
		 border-radius: 15px;
		 background-color: #fff;
		 margin-top: 5%;
		 box-shadow: 0 5px 20px 0 rgba(57, 115, 230, 0.1);
		 cursor: pointer;
		 border: 1px solid transparent;
		 transition: none;
		 box-sizing: border-box;
	}
	 .link-card .card-container .img-container {
		 text-align: center;
		 align-items: center;
	}
	 .link-card .card-container .img-container img {
		 width: 50%;
		 height: 50%;
	}
	 .link-card .card-container .card-title {
		 font-size: 1.75rem;
		 color: #4d4d4d;
		 font-weight: 500;
		 padding-top: 15px;
	}
	 .link-card .card-container .card-description {
		 font-family: var(--base-font-family, 'System stack', sans-serif);
		 color: #666;
		 font-size: 1.25rem;
		 letter-spacing: 0;
		 line-height: 28px;
		 padding: 15px;
	}
	 .link-card .card-container .learn-more {
		 font-family: var(--base-font-family, 'System stack', sans-serif);
		 margin-top: 10px;
	}
	 .link-card .card-container .learn-more .learn-more-text {
		 color: #3973e6;
		 font-size: 1.25rem;
	}
	 .link-card .card-container:hover, .link-card .card-container:focus {
		 transform: none;
		 box-shadow: none;
		 border-color: none;
	}
}
 @media only screen and (max-width: 27rem) {
	 .link-card {
		 text-decoration: none;
		 text-align: center;
	}
  @media (prefers-reduced-motion) {
    .link-card .card-container {
      transition: none;
    }
  }
	 .link-card .card-container {
		 height: 420px;
		 width: 90%;
		 margin: 0 auto;
		 border-radius: 15px;
		 background-color: #fff;
		 margin-top: 5%;
		 box-shadow: 0 5px 20px 0 rgba(57, 115, 230, 0.1);
		 cursor: pointer;
		 border: 1px solid transparent;
		 transition: transform 500ms;
		 box-sizing: border-box;
	}
	 .link-card .card-container .img-container {
		 text-align: center;
		 align-items: center;
	}
	 .link-card .card-container .img-container img {
		 width: 80%;
		 height: 80%;
	}
	 .link-card .card-container .card-title {
		 font-size: 1.25rem;
		 color: #4d4d4d;
		 font-weight: 500;
		 padding-top: 15px;
	}
	 .link-card .card-container .card-description {
		 font-family: var(--base-font-family, 'System stack', sans-serif);
		 color: #666;
		 font-size: 1rem;
		 letter-spacing: 0;
		 line-height: 28px;
		 padding: 15px;
	}
	 .link-card .card-container .learn-more {
		 font-family: var(--base-font-family, 'System stack', sans-serif);
		 margin-top: 10px;
	}
	 .link-card .card-container .learn-more .learn-more-text {
		 color: #3973e6;
		 font-size: 1rem;
	}
}
 @media only screen and (max-width: 27rem) and (prefers-reduced-motion: reduce) {
	 .link-card .card-container {
		 height: 420px;
		 width: 90%;
		 margin: 0 auto;
		 border-radius: 15px;
		 background-color: #fff;
		 margin-top: 5%;
		 box-shadow: 0 5px 20px 0 rgba(57, 115, 230, 0.1);
		 cursor: pointer;
		 border: 1px solid transparent;
		 transition: none;
		 box-sizing: border-box;
	}
	 .link-card .card-container .img-container {
		 text-align: center;
		 align-items: center;
	}
	 .link-card .card-container .img-container img {
		 width: 80%;
		 height: 80%;
	}
	 .link-card .card-container .card-title {
		 font-size: 1.25rem;
		 color: #4d4d4d;
		 font-weight: 500;
		 padding-top: 15px;
	}
	 .link-card .card-container .card-description {
		 font-family: var(--base-font-family, 'System stack', sans-serif);
		 color: #666;
		 font-size: 1rem;
		 letter-spacing: 0;
		 line-height: 28px;
		 padding: 15px;
	}
	 .link-card .card-container .learn-more {
		 font-family: var(--base-font-family,'System stack', sans-serif;
		 margin-top: 10px;
	}
	 .link-card .card-container .learn-more .learn-more-text {
		 color: #3973e6;
		 font-size: 1rem;
	}
}
 
</style>