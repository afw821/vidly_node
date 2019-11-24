export function reindexArray(args) {
       
    const reindexArray = [];

    $(args).find('option').each(function (index, element) {

        if ($(this).val()) {
            const value = $(element).val();
            const name = $(element).text();
            let reindexObject = { name: name, value: value }
            reindexArray.push(reindexObject);
        }
    });

    $(args).find('option').first().siblings().remove();
    // sort by name
    reindexArray.sort(function (a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA > nameB) {
            return -1;
        }
        if (nameA < nameB) {
            return 1;
        }
        return 0;
    });
    reindexArray.forEach(function (element, index, arr) {
        const id = element.value;
        const name = element.name;
        const sortedElement = `<option class="option-genre" value="${id}">${name}</option>`;

        $(args).find('option').first().after(sortedElement);
    });
}

