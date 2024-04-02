Vue.component('t-autocomplete', {
  props: {
    items: {
      type: Array,
      required: true
    },
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Type to search'
    },
    loading: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    itemValue: {
      type: String,
      default: 'value'
    },
    itemText: {
      type: String,
      default: 'text'
    },
    maxHeight: {
      type: [Number, String],
      default: 300
    },
    appendIcon: String,
    appendOuterIcon: String,
    attach: [String, Object],
    autoSelectFirst: Boolean,
    autofocus: Boolean,
    backgroundColor: String,
    cacheItems: Boolean,
    chips: Boolean,
    clearIcon: String,
    color: String,
    counter: [Boolean, Number, String],
    counterValue: Function,
    dark: Boolean,
    deletableChips: Boolean,
    dense: Boolean,
    disableLookup: Boolean,
    disabled: Boolean,
    eager: Boolean,
    error: Boolean,
    errorCount: [Number, String],
    errorMessages: [String, Array],
    filled: Boolean,
    filter: Function,
    flat: Boolean,
    fullWidth: Boolean,
    height: [Number, String],
    hideDetails: [Boolean, String],
    hideNoData: Boolean,
    hideSelected: Boolean,
    hint: String,
    id: String,
    itemColor: String,
    itemDisabled: [String, Array, Function],
    itemText: [String, Array, Function],
    itemValue: [String, Array, Function],
    label: String,
    light: Boolean,
    loaderHeight: [Number, String],
    menuProps: [String, Array, Object],
    messages: [String, Array],
    multiple: Boolean,
    noDataText: String,
    noFilter: Boolean,
    openOnClear: Boolean,
    outlined: Boolean,
    persistentHint: Boolean,
    persistentPlaceholder: Boolean,
    prefix: String,
    prependIcon: String,
    prependInnerIcon: String,
    readonly: Boolean,
    returnObject: Boolean,
    reverse: Boolean,
    rounded: Boolean,
    rules: Array,
    searchInput: String,
    shaped: Boolean,
    singleLine: Boolean,
    smallChips: Boolean,
    solo: Boolean,
    soloInverted: Boolean,
    success: Boolean,
    successMessages: [String, Array],
    suffix: String,
    validateOnBlur: Boolean,
    valueComparator: Function,
    // New events from v-autocomplete
    blur: Function,
    change: Function,
    click: Function,
    'click:append': Function,
    'click:append-outer': Function,
    'click:clear': Function,
    'click:prepend': Function,
    'click:prepend-inner': Function,
    focus: Function,
    input: Function,
    keydown: Function,
    mousedown: Function,
    mouseup: Function,
    'update:error': Function,
    'update:list-index': Function,
    'update:search-input': Function
  },
  data() {
    return {
      searchText: '',
      isOpen: false,
      selectedItems: []
    }
  },
  computed: {
    filteredItems() {
      return this.items.filter(item => item[this.itemText].toLowerCase().includes(this.searchText.toLowerCase()));
    }
  },
  watch: {
    value(newValue) {
      this.selectedItems = newValue ? this.items.filter(item => item[this.itemValue] === newValue) : [];
    },
    selectedItems(newSelectedItems) {
      this.$emit('input', this.multiple ? newSelectedItems.map(item => item[this.itemValue]) : (newSelectedItems[0] ? newSelectedItems[0][this.itemValue] : ''));
    }
  },
  methods: {
    selectItem(item) {
      if (this.multiple) {
        const index = this.selectedItems.findIndex(selectedItem => selectedItem[this.itemValue] === item[this.itemValue]);
        if (index === -1) {
          this.selectedItems.push(item);
        } else {
          this.selectedItems.splice(index, 1);
        }
      } else {
        this.selectedItems = [item];
        this.searchText = item[this.itemText];
        this.isOpen = false; // Close the dropdown after selecting an item
      }
    },

    clearSelection() {
      this.selectedItems = [];
      this.searchText = '';
      this.isOpen = false;
    },
    onFocus() {
      this.isOpen = true;
      this.$emit('focus');
    },

    onInputChange() {
      this.$emit('change', this.searchText);
    },

    onClick() {
      this.$emit('click');
    },
    onClickAppend() {
      this.$emit('click:append');
    },
    onClickAppendOuter() {
      this.$emit('click:append-outer');
    },
    onClickClear() {
      this.$emit('click:clear');
    },
    onClickPrepend() {
      this.$emit('click:prepend');
    },
    onClickPrependInner() {
      this.$emit('click:prepend-inner');
    },
    onInput() {
      this.$emit('input', this.searchText);
    },
    onKeyDown(event) {
      this.$emit('keydown', event);
    },
    onMouseDown(event) {
      this.$emit('mousedown', event);
    },
    onMouseUp(event) {
      this.$emit('mouseup', event);
    },
    onUpdateError(value) {
      this.$emit('update:error', value);
    },
    onUpdateListIndex(value) {
      this.$emit('update:list-index', value);
    },
    onUpdateSearchInput(value) {
      this.$emit('update:search-input', value);
    }
  },
  template: `
  <div class="overflow-hidden rounded-lg bg-white shadow-md relative w-full max-w-lg transform mx-4 transition-all opacity-100 scale-100">
    <input 
        v-model="searchText" 
        @focus="onFocus" 
        @input="onInputChange"
        @click="onClick"
        @keydown="onKeyDown"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        class="block w-full appearance-none bg-transparent py-4 pl-4 pr-12 text-base text-slate-900 placeholder:text-slate-600 focus:outline-none sm:text-sm sm:leading-6"
        :placeholder="placeholder"
        :disabled="disabled"
    >
    <ul v-if="isOpen && filteredItems.length > 0 && selectedItems.length === 0" class="max-h-[18.375rem] divide-y divide-slate-200 overflow-y-auto rounded-b-lg border-t border-slate-200 text-sm leading-6" :style="{ maxHeight: maxHeight + 'px' }">
      <li 
        v-for="item in filteredItems" 
        :key="item[itemValue]"
        @click="selectItem(item)"
        class="flex items-center justify-between p-4"
      >
          {{ item[itemText] }}
      </li>
    </ul>
    <button v-if="clearable && searchText" @click="clearSelection" class="absolute top-0 right-0 m-2 text-gray-600 focus:outline-none">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
    <div v-if="loading" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <svg class="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2.5A1.5 1.5 0 0010.5 1h-1A1.5 1.5 0 008 2.5V4a8 8 0 014 7.33V12h2.5a1.5 1.5 0 001.5-1.5v-1A1.5 1.5 0 0014.5 8H13"></path></svg>
    </div>
  </div>
    `
});