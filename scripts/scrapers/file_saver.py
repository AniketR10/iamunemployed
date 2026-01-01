import json
import sys

def save_common_data(source_name, articles):

    for article in articles:
        article["source"] = source_name

    json_output = json.dumps(articles)

    print(f"__DATA_START__{json_output}__DATA_END__")

    sys.stdout.flush()