export type DotLottieAnimationMetadata = {
  id?: string;
  direction?: number;
  speed?: number;
  playMode?: string;
  loop?: boolean;
  autoplay?: boolean;
  hover?: boolean;
  intermission?: number;
};

export type DotLottieMetadata = {
  version?: string;
  revision?: number;
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
