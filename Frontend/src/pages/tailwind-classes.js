// 이 파일은 실제로 실행되지 않고, 단지 클래스 스캔용으로만 사용됩니다
const classes = {
  // 배경 색상
  backgrounds: `
    tw-bg-blue-500
    tw-bg-gray-100 tw-bg-gray-200 tw-bg-gray-300 tw-bg-gray-400 tw-bg-gray-500 tw-bg-gray-600 tw-bg-gray-800
    tw-bg-slate-100 tw-bg-slate-200 tw-bg-slate-300 tw-bg-slate-400 tw-bg-slate-600 tw-bg-slate-800
    tw-bg-zinc-100 tw-bg-zinc-200 tw-bg-zinc-300 tw-bg-zinc-400 tw-bg-zinc-600 tw-bg-zinc-800
  `,

  // 투명도가 있는 배경
  backgroundsWithOpacity: `
    tw-bg-gray-300/90 tw-bg-gray-300/80 tw-bg-gray-300/70 tw-bg-gray-300/60
    tw-bg-gray-300/50 tw-bg-gray-300/40 tw-bg-gray-300/30 tw-bg-gray-300/20 tw-bg-gray-300/10
    tw-bg-transparent
    tw-opacity-30 tw-opacity-40 tw-opacity-50 tw-opacity-60 tw-opacity-70 tw-opacity-80 tw-opacity-90
  `,

  // 텍스트 관련
  text: `
    tw-text-white tw-text-red-500 tw-text-green-500 tw-text-yellow-500 tw-text-purple-500 tw-text-pink-500
    tw-text-3xl tw-text-xl tw-text-lg tw-text-base tw-text-sm tw-text-xs tw-text-[13px] tw-text-[14px]
    tw-font-semibold
  `,

  // 텍스트에리어
  textarea: `
    tw-textarea tw-textarea-primary tw-textarea-outline tw-textarea-active
    tw-textarea-lg tw-textarea-md tw-textarea-sm tw-textarea-xs
    tw-textarea-bordered tw-textarea-unstyled
    tw-textarea-sm tw-textarea-md tw-textarea-lg
    tw-textarea-xl
    tw-resize-none
  `,

  // 라운드
  rounded: `
    tw-rounded-2xl tw-rounded-t-2xl tw-rounded-b-2xl tw-rounded-l-2xl tw-rounded-r-2xl
  `,

  // 테두리 기본
  borders: `
    tw-border tw-border-2 tw-border-base-300

  `,

  // 상단 테두리
  borderTop: `
    tw-border-t
    tw-border-t-black
    tw-border-t-gray-200 tw-border-t-gray-300 tw-border-t-gray-500 tw-border-t-gray-800 
    tw-border-t-white
  `,

  // 하단 테두리
  borderBottom: `
    tw-border-b
    tw-border-b-2
    tw-border-b-black
    tw-border-b-gray-200 tw-border-b-gray-300 tw-border-b-gray-500 tw-border-b-gray-800
  `,

  // 좌측 테두리
  borderLeft: `
    tw-border-l
    tw-border-l-black
    tw-border-l-gray-200 tw-border-l-gray-300 tw-border-l-gray-500 tw-border-l-gray-800
  `,

  // 우측 테두리
  borderRight: `
    tw-border-r
    tw-border-r-black
    tw-border-r-gray-200 tw-border-r-gray-300 tw-border-r-gray-500 tw-border-r-gray-800
    tw-border-r-white
    tw-border-r-0
  `,

  // 색상이 있는 테두리
  coloredBorders: `
    tw-border-blue-500 tw-border-red-300 tw-border-green-400
    tw-border-yellow-600 tw-border-purple-700 tw-border-pink-400
  `,

  // 레이아웃
  layout: `
    tw-flex tw-grid
    tw-justify-between tw-justify-center
    tw-grid-cols-1 tw-grid-cols-2 tw-grid-cols-3 tw-grid-cols-4 tw-grid-cols-5 tw-grid-cols-6
    tw-grid-cols-7 tw-grid-cols-8 tw-grid-cols-9 tw-grid-cols-10 tw-grid-cols-11 tw-grid-cols-12
    tw-gap-2 tw-gap-3 tw-gap-4 tw-gap-5 tw-gap-6
    tw-flex-1 tw-flex-2 tw-flex-3 tw-flex-4 tw-flex-5 tw-flex-6
  `,

  // 크기 관련
  sizing: `
    tw-w-1/3 tw-w-2/3 tw-w-1/4 tw-w-3/4 tw-w-1/5 tw-w-2/5 tw-w-3/5 tw-w-4/5 tw-w-10 tw-w-50 tw-w-[300px] tw-w-32
    tw-w-[12.5%] tw-w-[75%] tw-w-[25%] tw-w-[50%]  
    tw-min-w-[12.5%] tw-min-w-[75%] tw-min-w-[25%] tw-min-w-[50%] tw-min-w-[40%] tw-min-w-[80%]
    tw-max-w-[12.5%] tw-max-w-[75%] tw-max-w-[25%] tw-max-w-[50%] tw-max-w-[40%] tw-max-w-[80%]
    tw-min-w-6 tw-min-w-8 tw-min-w-12 tw-min-w-14 tw-min-w-52
    tw-max-w-6 tw-max-w-8 tw-max-w-12 tw-max-w-14 tw-max-w-52
    tw-min-h-6 tw-min-h-8 tw-min-h-12 tw-min-h-14 tw-min-h-52
    tw-h-6 tw-h-8 tw-h-12 tw-h-14 tw-h-96
    tw-min-h-[300px] tw-max-h-[300px]
    tw-w-full tw-min-w-full tw-max-w-full tw-h-full tw-min-h-full tw-max-h-full
    tw-h-auto
  `,

  // divider
  divider: `
    tw-divider tw-divider-horizontal tw-divider-vertical
    tw-divider-primary tw-divider-secondary tw-divider-accent tw-divider-ghost
    tw-divider-info tw-divider-success tw-divider-warning tw-divider-error
    tw-divider-neutral
  `,

  // Grid Column Spans
  gridColumns: `
    tw-col-span-1 tw-col-span-2 tw-col-span-3 tw-col-span-4 tw-col-span-5 tw-col-span-6
    tw-col-span-7 tw-col-span-8 tw-col-span-9 tw-col-span-10 tw-col-span-11 tw-col-span-12
    tw-row-span-1 tw-row-span-2 tw-row-span-3 tw-row-span-4 tw-row-span-5 tw-row-span-6
  `,

  // 컴포넌트 관련
  components: `
    tw-btn-primary tw-btn-outline tw-btn-active tw-btn-secondary tw-btn-ghost tw-btn-link tw-btn-ghost tw-btn-link tw-btn-sm tw-btn-md tw-btn-lg tw-btn-xl tw-btn-neutral
    tw-input tw-input-bordered tw-input-primary tw-input-bordered tw-input-active tw-input-sm tw-input-md tw-input-lg tw-input-xs
    tw-radio tw-radio-primary tw-radio-outline tw-radio-active tw-radio-disabled
    tw-checkbox tw-checkbox-primary tw-checkbox-outline tw-checkbox-active
    tw-checkbox-disabled tw-checkbox-checked tw-checkbox-unchecked
    tw-label tw-label-text
    tw-badge tw-badge-primary tw-badge-outline tw-badge-active
    tw-btn-xs
  `,

  // 유틸리티
  utilities: `
    tw-p-4 tw-p-10
    tw-px-4 tw-px-10
    tw-py-4 tw-py-10
    tw-mt-2
    tw-cursor-pointer
    tw-pointer-events-none
    tw-overflow-y-auto tw-overflow-x-auto
    -tw-m-4
    tw-fixed tw-bottom-4 tw-right-4 tw-bottom-12 tw-right-12 tw-right-6
    tw-z-[9999] tw-block
    tw-hidden
    tw-relative
    tw-swap
    tw-swap-rotate
    tw-swap-off
    tw-swap-on
    tw-fill-current
    tw-bottom-full
    tw-rounded-box
  `,

  // 테이블에서 사용
  table: `
    tw-overflow-x-auto
    tw-table-zebra
    tw-hover
    tw-table
    tw-table-pin-rows
    tw-table-pin-cols
  `,

  // select
  select: `
    tw-select tw-select-primary tw-select-outline tw-select-active
    tw-select-lg tw-select-md tw-select-sm tw-select-xs
    tw-select-bordered tw-select-unstyled
    tw-select-sm tw-select-md tw-select-lg
    tw-select-xl tw-select-2xl
    tw-select-3xl tw-select-4xl
    tw-select-5xl tw-select-6xl
    tw-select-7xl tw-select-8xl
    tw-select-9xl tw-select-10xl
    tw-appearance-none
    tw-select-ghost

  `,

  // tab
  tab: `
    tw-tab tw-tab-active tw-tabs-bordered tw-tabs
  `,

  // card
  card: `
    tw-card tw-shadow-xl tw-card-body tw-card-title tw-card-subtitle tw-card-actions
  `,
};
