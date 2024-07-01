function AutoFormTooltip({ fieldConfigItem }: { fieldConfigItem: any }) {
  return (
    <>
      {fieldConfigItem?.description && (
        <span className="text-sm text-gray-500 dark:text-white">
          {fieldConfigItem.description}
        </span>
      )}
    </>
  );
}

export default AutoFormTooltip;
