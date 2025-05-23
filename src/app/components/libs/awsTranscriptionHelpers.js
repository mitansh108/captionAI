export function clearTranscriptionItems(items) {
    const mergedItems = [];
  
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
  
      if (!item.start_time && mergedItems.length > 0) {
        // Merge punctuation or filler word into the previous item's content
        mergedItems[mergedItems.length - 1].alternatives[0].content += item.alternatives[0].content;
      } else {
        mergedItems.push(item);
      }
    }
  
    return mergedItems.map((item) => {
      const { start_time, end_time } = item;
      const content = item.alternatives[0].content;
      return { start_time, end_time, content };
    });
  }
  