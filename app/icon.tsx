import { ImageResponse } from 'next/server';

export const size = {
  width: 48,
  height: 48,
};

export const contentType = 'image/png';

export default function Icon() {
  const backgroundColor = '#0F172A';
  const textColor = '#F8FAFC';

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: backgroundColor,
          borderRadius: '12px',
          color: textColor,
          display: 'flex',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 28,
          fontWeight: 700,
          height: '100%',
          justifyContent: 'center',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          width: '100%',
        }}
      >
        RTE
      </div>
    ),
    {
      ...size,
    }
  );
}
