import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>;
  image?: string;
  style?: React.CSSProperties;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Framework Agnostic',
    image: 'img/framework-agnostic.webp',
    style: {
      height: '16rem',
      width: '16rem',
      marginBottom: '-2rem',
    },
    description: (
      <>
        It can be used with any framework. You can use it with React, Vue, Angular, or any other framework.
      </>
    ),
  },
  {
    title: 'Automate Caching',
    image: 'img/automate-cache.webp',
    description: (
      <>
        Reactive Query lets you automate caching and staling with different strategies and autmoate invalidation.
      </>
    ),
  },
  {
    title: 'Microfrontend Friendly',
    image: 'img/microfrontend-friendly.webp',
    description: (
      <>
        Reactive Query can be used in a single-spa, a microfrontend application. Separate your data logics and let your teams, focus on just UI and UI Logics.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

function FeatureWithPng({image, title, description, style}: {image: string, title: string, description: ReactNode, style?: React.CSSProperties}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img style={{
          width: '14rem',
          height: '14rem',
          objectFit: 'contain',
          ...style,
        }} src={image} alt={title} className={styles.featureImage} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {
          FeatureList.map((props, idx) => {
            if (props.image) {
              return <FeatureWithPng key={idx} style={props.style} image={props.image} title={props.title} description={props.description} />
            }
          return   (
              <Feature key={idx} {...props} />
            );
          })
          } 
        </div>
      </div>
    </section>
  );
}
