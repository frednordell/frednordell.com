---
author:
- Fred Nordell
date: November 2021
postedAt: 2021-11-09
title: Why is my lighthouse score so bad?
description: Even though the page is rather fast when using a computer hooked up to a broadband connection lighthouse has some damning numbers for me. This is the tale of how i fixed it and what ultimatly solved the issue.
---

# Background
So when I started out with this page it was was a simple react app and a node backend that only served the page now called intro. This worked fine for what i wanted, but as the pandemic hit i had some time on my hands and decided to re-write the app to a next.js app and, for better or worse, decided that i should have a gallery of some of my photos. And as you might have discovered, a blog. 

This however resulted in some problems as i had used material-ui to style my page on the client-side. Next.js however is server side rendered and as such i cobbeled together something that looked the same as the old page, but my lighthouse score is now [abominable](/post/lighthouse/#fig:lighthouse-score).

![Lighthouse score#fig:lighthouse-score](lighthouse-score.png)

# Finding the culprit

This section will discuss the different fixes that i tried to make the performance great again.

## SSR with Material-UI

So it turns out that Material-Ui supports server side rendering, but I have just implemented it wrongly. According to [the docs](https://material-ui.com/guides/server-rendering/#material-ui-on-the-server) I need to do a couple of things to make sure it's correctly integrated.

1. Create a fresh, new `ServerStyleSheets` instance on every request.
2. Render the React tree with the server-side collector.
3. Pull the CSS out.
4. Pass the CSS along to the client.

Here we see how i have my `_document.tsx` set up as in the [next.js material ui example](https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_document.js).

```ts
MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  };
};
```

## The backtrack

Digging deeper into the lighthouse report i realise this is not the way. The biggest oppurtunity that lighthouse promotes is `Remove unused javascript`. Estimated savings: 29.55 seconds. what?

This does not seems right. 

it turns out that google thinks that the full sized png that is loaded is unused. I'm using the [trace-loader](https://www.npmjs.com/package/next-image-trace-loader) to load a trace of the image before the .webp is loaded. Or so i thought.

It turs out I've been doing it all wrong, or half wrong anyway.
I'm loading the images with require, as i should.

```ts
traceSrc={require(`content/${this.src}?trace`)}
webpSrc={require(`content/${this.src}?webp`)}
```
But, in the Image module I'm not using the image-trace module from the package.

Changing from the following code with some "smart" onLoad shenanigans to hide the trace image when the webp is loaded:

```ts 
<img
  id={"trace-" + alt}
  style={styles.styles.trace}
  alt={alt}
  className={className}
  src={traceSrc.trace}
/>
<img
  ref={imgRef}
  style={styles.styles.webp}
  onLoad={onLoad}
  alt={alt}
  className={className}
  src={webpSrc}
/>
```

to 

```ts 
<ImageTrace
  src={webpSrc}
  trace={traceSrc.trace}
  nextImageProps={{
    //layout: 'fill',
    width: 'auto',
    height: 'auto',
    className: className,
    alt: alt
  }}
></ImageTrace>
```
resulted in a massive headache.

## Don't make it complicated.

What I decided to do, partly because I could not be bothered to muck about with this anymore and wanted to focus on other things and partly because I left it for too long and forgot most of what I had done to "fix" things, was to simply go back to using "next/images".

One advantage of this is of course the "it just works" factor, but more to the point I reduce the number of dependencies. Something that has been highlighted by the recent [ua-parser](https://us-cert.cisa.gov/ncas/current-activity/2021/10/22/malware-discovered-popular-npm-package-ua-parser-js) malware story.