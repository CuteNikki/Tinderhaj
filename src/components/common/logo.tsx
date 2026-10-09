export function Logo({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' aria-label='Tinderhaj Logo' {...props} viewBox='0 0 128 128'>
      {/* The body */}
      <path
        d='M102.3 37.6C114.8 47.93 115.5 63.07 117.79 78.18C118.9 85.5 121.4 99 121 107C113.77 116.71 99.73 118.71 88.46 120.6C81.9 121.34 75.28 121.25 68.69 121.25L66.5 121.25C13.2 121.2 13.2 121.2 5 113C3.53 94.68 9.8 75.95 21.55 61.86C39.28 41.51 75.96 19.17 102.3 37.6Z'
        fill='#E6E6E8'
      />
      {/* The back, along the body's own edge; outlined in its color so no white shows around it */}
      <path
        d='M102.3 37.6C114.8 47.93 115.5 63.07 117.79 78.18C118.9 85.5 121.4 99 121 107C114.85 115.25 103.79 117.93 93.69 119.72C88.5 118.5 86 113 84.3 107C82.9 102 82.7 96.5 82.7 90C82.7 81.5 83.3 74.5 84.5 68.3C85.2 64.5 85.4 60.5 85.4 55.5C85.4 50.2 84 46.3 81 43.2C77.5 39.6 64 37.5 49.98 39.24C66.91 30.17 86.46 26.56 102.3 37.6Z'
        fill='#55899B'
        stroke='#55899B'
        strokeWidth='0.5'
        strokeLinejoin='round'
      />
      <ellipse cx='99.7' cy='87.2' rx='11.6' ry='11' transform='rotate(-20 99.7 87.2)' fill='#2F1635' />
      <path
        d='M31 61V71C31 73 32.5 73.3 35 72.6C40 71.3 44.5 73.5 48 77C50.2 79.3 52.4 79.8 54.3 77.2L59 66.5'
        fill='none'
        stroke='#352436'
        strokeWidth='4.6'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
