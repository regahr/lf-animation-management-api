export type DotLottieAnimationMetadata = {
  id?: string;
  direction?: string;
  speed?: string;
  playMode?: string;
  loop?: boolean;
  autoplay?: boolean;
  hover?: boolean;
  intermission?: number;
};

export type DotLottieMetadata = {
  version?: string;
  revision?: string;
  keywords?: string;
  author?: string;
  generator?: string;
  animations?: DotLottieAnimationMetadata[];
} | null;

export type JsonLottieAnimation = {
  v?: string;
  ip?: string;
  op?: string;
  fr?: string;
  w?: string;
  h?: string;
  nm?: string;
} | null;
