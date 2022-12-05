/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
    config.toolbarGroups = [
        //{ name: 'document', groups: ['mode', 'document'] }, //'doctools'
        //{ name: 'undo', groups: ['undo'] }, //'clipboard', 
        //{ name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        //{ name: 'paragraph', groups: ['list', 'align', 'paragraph'] }, //'indent', 'blocks', 'bidi'
        //{ name: 'editing', groups: ['selection', 'spellchecker', 'editing'] }, //'find', 
        //{ name: 'forms', groups: ['forms'] },
        //'/',
        //{ name: 'links', groups: ['links'] }, 
        //{ name: 'insert', items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
        //{ name: 'insert', groups: ['insert'] },
        //'/',
        //{ name: 'styles', groups: ['styles'] },
        //{ name: 'colors', groups: ['colors'] },
        //{ name: 'tools', groups: ['tools'] },
        //{ name: 'others', groups: ['others'] },
        //{ name: 'about', groups: ['about'] }
    ];

    config.toolbar = [
        { name: 'document', groups: ['mode', 'document', 'doctools'], items: ['Source', '-', 'Save', 'NewPage', 'ExportPdf', 'Preview', 'Print', '-', 'Templates'] },
        { name: 'clipboard', groups: ['clipboard', 'undo'], items: ['Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo'] }, //'PasteText', 'PasteFromWord',
        { name: 'editing', groups: ['find', 'selection', 'spellchecker'], items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'] },
        //{ name: 'forms', items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'] },
        '/',
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'], items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'] },
        { name: 'paragraph', groups: ['list', 'indent', 'align', 'bidi'], items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'] }, //'Blockquote', 'CreateDiv', '-', 'Language','blocks'
        //{ name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
        { name: 'insert', items: ['Table'] }, //'Image', 'Flash',, 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'
        '/',
        { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
        { name: 'colors', items: ['TextColor', 'BGColor'] },
        //{ name: 'tools', items: ['Maximize', 'ShowBlocks'] },
        //{ name: 'others', items: ['-'] },
        //{ name: 'about', items: ['About'] }
    ];


};
