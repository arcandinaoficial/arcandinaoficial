'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { 
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
export const usePrevNextButtons = (emblaApi, onButtonClick) => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
    if (onButtonClick) onButtonClick(emblaApi)
  }, [emblaApi, onButtonClick])

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
    if (onButtonClick) onButtonClick(emblaApi)
  }, [emblaApi, onButtonClick])

  const onSelect = useCallback((emblaApi) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect).on('select', onSelect)
  }, [emblaApi, onSelect])

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  }
}

export const PrevButton = (props) => {
  const { children, ...restProps } = props

  return (
    <button
      className="carousel__button"
      type="button"
      {...restProps}
    >
      <ChevronLeft color={'#faf9f6'} size={50} />
    </button>
  )
}

export const NextButton = (props) => {
  const { children, ...restProps } = props

  return (
    <button
      className="carousel__button embla__button--next"
      type="button"
      {...restProps}
    >
      <ChevronRight color={'#faf9f6'} size={50} />
    </button>
  )
}
