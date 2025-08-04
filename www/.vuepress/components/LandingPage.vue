<template>
  <div class="landing-container">
    <div class="landing-header">
      <div class="fw-logo">
        <a :href="freshworksUrl" target="_blank">
          <img src="../public/assets/logo-fworks-black.svg" alt="freshworks" />
        </a>
      </div>
      <div class="github-logo">
        <a :href="repoUrl" target="_blank">
          <img src="../public/assets/github-logo.svg" />
        </a>
      </div>
    </div>

    <div class="crayons-logo">
      <img src="../public/assets/crayons-logo.svg" alt="Crayons Logo" />
    </div>

    <div class="crayons-description">
      A refreshed design library for Freshworks Developers.
    </div>

    <div class="link-cards-container">
      <DetailCard
        v-for="welcomeLink in welcomeLinks"
        :key="welcomeLink.name"
        :card-link="welcomeLink.link"
        :card-name="welcomeLink.name"
        :card-title="welcomeLink.title"
        :card-description="welcomeLink.description"
      />
    </div>
    <Dialogue />
  </div>
</template>

<script>
import constants from '../constants';

const { urlMap } = constants;

export default {
  name: 'landingPage',
  data() {
    return {
      welcomeLinks: [
        {
          name: 'get-started',
          title: 'Get Started',
          description:
            'Craft great apps with an open-source and framework-agnostic component library.',
          link: urlMap.docs,
        },
        {
          name: 'sample-app-repo',
          title: 'Sample App Repository',
          description:
            'Accelerate development by using the sample apps in the repository.',
          link: urlMap.sampleApps,
        },
        {
          name: 'build-for-crayons',
          title: 'Build For Crayons',
          description:
            'Browse through the contributor guidelines to raise an issue or build new components.',
          link: urlMap.crayons,
        },
      ],
      freshworksUrl: urlMap.freshworks,
      repoUrl: urlMap.crayons,
    };
  },
};
</script>

<style lang="css">
:root {
	 font-family: var(--base-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif);
}
 .landing-container {
	 width: 1000px;
	 margin: 0 auto;
}
 .landing-container .landing-header {
	 display: flex;
	 justify-content: space-between;
}
 .landing-container .landing-header .fw-logo {
	 margin-top: 1%;
}
 .landing-container .landing-header .fw-logo img {
	 width: 90%;
	 height: 90%;
}
 .landing-container .landing-header .github-logo {
	 float: right;
	 padding: 0;
	 margin-top: 3%;
}
 .landing-container .landing-header .github-logo img {
	 margin-left: 70%;
	 width: 40%;
	 height: 40%;
	 opacity: 0.5;
}
 .landing-container .landing-header .github-logo img:hover, .landing-container .landing-header .github-logo img:focus {
	 opacity: 1;
}
 .landing-container .crayons-logo {
	 margin-top: 6%;
	 text-align: center;
}
 .landing-container .crayons-logo img {
	 width: 40%;
	 height: 40%;
}
 .landing-container .crayons-description {
	 color: #666;
	 font-size: 16.5px;
	 font-weight: 400;
	 line-height: 28px;
	 margin-top: 15px;
	 text-align: center;
}
 .landing-container .link-cards-container {
	 margin-top: 7%;
	 box-sizing: border-box;
	 display: grid;
	 grid-template-columns: 320px 320px 320px;
	 grid-column-gap: 20px;
}
 @media only screen and (max-width: 48rem) {
	 .landing-container {
		 margin: 0 auto;
		 width: 95%;
	}
	 .landing-container .landing-header {
		 display: flex;
		 justify-content: space-between;
	}
	 .landing-container .landing-header .fw-logo {
		 margin-left: 5%;
	}
	 .landing-container .landing-header .fw-logo img {
		 width: 70%;
		 height: 70%;
	}
	 .landing-container .landing-header .github-logo img {
		 margin-left: 40%;
		 width: 40%;
		 height: 40%;
	}
	 .landing-container .crayons-logo {
		 margin-top: 6%;
		 text-align: center;
	}
	 .landing-container .crayons-logo img {
		 width: 70%;
		 height: 70%;
	}
	 .landing-container .crayons-description {
		 color: #666;
		 font-size: 1.5rem;
		 font-weight: 400;
		 line-height: 28px;
		 margin-top: 15px;
		 text-align: center;
	}
	 .landing-container .link-cards-container {
		 display: block;
	}
}
 @media only screen and (max-width: 27rem) {
	 .landing-container {
		 margin: 0 auto;
		 width: 100%;
	}
	 .landing-container .landing-header {
		 display: flex;
		 justify-content: space-between;
	}
	 .landing-container .landing-header .fw-logo {
		 margin-left: 5%;
	}
	 .landing-container .landing-header .fw-logo img {
		 width: 60%;
		 height: 60%;
	}
	 .landing-container .landing-header .github-logo img {
		 margin-left: 60%;
		 width: 35%;
		 height: 35%;
	}
	 .landing-container .crayons-logo {
		 margin-top: 6%;
		 text-align: center;
	}
	 .landing-container .crayons-logo img {
		 width: 70%;
		 height: 70%;
	}
	 .landing-container .crayons-description {
		 color: #666;
		 font-size: 1.25rem;
		 font-weight: 400;
		 line-height: 28px;
		 margin-top: 15px;
		 text-align: center;
	}
	 .landing-container .link-cards-container {
		 display: block;
	}
}
 
</style>